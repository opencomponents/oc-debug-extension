'use strict';

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  switch (msg.type) {
    case 'UPDATE_BADGE':
      chrome.browserAction.setBadgeText({text: msg.state.toString(), tabId: sender.tab.id});
  }
});