function browserApi() {
  return typeof browser !== 'undefined' ? browser : chrome;
}

export function runtimeGetId() {
  return browserApi().runtime.id;
}

export function runtimeGetUrl(path: string) {
  return browserApi().runtime.getURL(path);
}

export function runtimeCreateTab(options: chrome.tabs.CreateProperties) {
  return browserApi().tabs.create(options);
}

export function runtimeOnClickedAddListener(listener: () => void) {
  browserApi().action.onClicked.addListener(listener);
}

export function runtimeOnMessageAddListener(
  // biome-ignore lint/suspicious/noExplicitAny: any
  listener: (message: any, sender: any, sendResponse: (response: any) => void) => void,
) {
  if (typeof browser !== 'undefined') {
    return browser.runtime.onMessage.addListener(listener);
  }
  return chrome.runtime.onMessage.addListener(listener);
}

// biome-ignore lint/suspicious/noExplicitAny: any
export function runtimeSendMessage(message: any) {
  if (typeof browser !== 'undefined') {
    return browser.runtime.sendMessage(message);
  }
  return chrome.runtime.sendMessage(message);
}

// biome-ignore lint/suspicious/noExplicitAny: any
export function runtimeUpdateDynamicRules(params: any) {
  return browserApi().declarativeNetRequest.updateDynamicRules(params);
}
