// background.js
console.log("Background script loaded.");

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
