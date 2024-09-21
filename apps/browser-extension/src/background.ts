import {
  runtimeCreateTab,
  runtimeGetId,
  runtimeGetUrl,
  runtimeOnClickedAddListener,
  runtimeOnMessageAddListener,
  runtimeSendMessage,
  runtimeUpdateDynamicRules,
} from './runtime';

(() => {
  const optionsPageUrl = runtimeGetUrl('options.html');

  runtimeOnClickedAddListener(() => {
    runtimeCreateTab({
      url: optionsPageUrl,
    });
  });

  // Remove Origin header from requests
  runtimeUpdateDynamicRules({
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          requestHeaders: [{ header: 'Origin', operation: 'remove' }],
        },
        condition: {
          urlFilter: '|http://localhost:11434/*',
          initiatorDomains: [runtimeGetId()],
        },
      },
    ],
    removeRuleIds: [1],
  });

  const signalControllerMap = new Map<string, AbortController>();

  runtimeOnMessageAddListener((message, sender, sendResponse) => {
    if (sender.url !== optionsPageUrl) return Promise.reject();

    switch (message.type) {
      case 'fetchJson': {
        const { url, options } = message.payload;
        fetch(url, options)
          .then((resp) => resp.json())
          .then((data) => sendResponse({ status: 'ok', data }));

        return true;
      }
      case 'fetchReader': {
        const { url, options = {}, requestId } = message.payload;
        const signalController = new AbortController();
        signalControllerMap.set(requestId, signalController);

        (async () => {
          const reader = await fetch(url, {
            ...options,
            signal: signalController.signal,
          })
            .then((resp) => resp.body)
            .then((body) => {
              const reader = body?.getReader();
              if (!reader) throw new Error('No reader');
              return reader;
            });

          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();

            const chunk = decoder.decode(value);
            runtimeSendMessage({
              type: 'fetchReader:write',
              payload: {
                requestId,
                chunk,
                done,
              },
            });

            if (done) break;
          }
        })();

        sendResponse({ status: 'ok' });
        return true;
      }
      case 'fetchReader:abort': {
        const { requestId } = message.payload;
        const controller = signalControllerMap.get(requestId);
        if (!controller) {
          console.error('No signal controller found for requestId:', requestId);
          return false;
        }

        controller.abort();
        signalControllerMap.delete(requestId);
        return true;
      }
    }

    return Promise.reject();
  });
})();
