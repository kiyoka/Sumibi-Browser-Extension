// background.js
console.log("Background script loaded.");

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sumibi-edit",
    title: "Edit with Sumibi",
    contexts: ["editable"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sumibi-edit" && tab.id) {
    chrome.tabs.sendMessage(tab.id, { type: "open_sumibi_dialog" });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "textarea_clicked") {
    console.log("Background script received textarea_clicked message.");
    chrome.storage.local.set({ textareaClicked: true }, function() {
      if (chrome.runtime.lastError) {
        console.error("Error setting textareaClicked in storage:", chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log("textareaClicked flag set to true in chrome.storage.local.");
        sendResponse({ success: true });
      }
    });
    return true;
  }
});
