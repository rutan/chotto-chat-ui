// global style
import '@chotto-chat/shared/global.css';

// code
import { init } from '@chotto-chat/shared';
import { v4 as uuidV4 } from 'uuid';
import { runtimeGetId, runtimeOnMessageAddListener, runtimeSendMessage } from './runtime';

(() => {
  const streamControllerMap = new Map<string, ReadableStreamController<unknown>>();

  runtimeOnMessageAddListener((message, sender, _sendResponse) => {
    if (sender?.id !== runtimeGetId()) return;

    switch (message.type) {
      case 'fetchReader:write': {
        const { requestId, chunk, done } = message.payload;
        const controller = streamControllerMap.get(requestId);
        if (!controller) {
          console.error('No stream controller found for requestId:', requestId);
          return;
        }

        controller.enqueue(chunk);
        if (done) {
          controller.close();
          streamControllerMap.delete(requestId);
        }

        break;
      }
    }
  });

  init({
    config: {
      limitedEndpoint: true,
      fetchFns: {
        fetchJsonFn: async (input, init) => {
          return runtimeSendMessage({
            type: 'fetchJson',
            payload: {
              url: input,
              options: init,
            },
          }).then((response) => {
            return response.data;
          });
        },
        fetchReaderFn(input, init) {
          const requestId = uuidV4();

          const stream = new ReadableStream({
            start(controller) {
              streamControllerMap.set(requestId, controller);
            },
          });
          const reader = new ReadableStreamDefaultReader(stream);

          init?.signal?.addEventListener('abort', () => {
            const controller = streamControllerMap.get(requestId);
            controller?.close();
            streamControllerMap.delete(requestId);

            runtimeSendMessage({
              type: 'fetchReader:abort',
              payload: {
                requestId,
              },
            });
          });

          return runtimeSendMessage({
            type: 'fetchReader',
            payload: {
              requestId,
              url: input,
              options: init,
            },
          }).then((_response) => {
            return reader;
          });
        },
      },
    },
  });
})();
