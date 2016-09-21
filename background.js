'use strict';

console.log('Started');

// This script injects our clearCookies.js script onto the current page when the extension's button is clicked
chrome.browserAction.onClicked.addListener((tab) => {
    console.log(tab);
    chrome.tabs.executeScript(tab.id, {
        file: 'clearCookies.js'
    });
});
