// background.js
console.log("Background script loaded.");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "textarea_clicked") {
    console.log("Background script received textarea_clicked message.");
    chrome.storage.local.set({ textareaClicked: true }, function() {
      if (chrome.runtime.lastError) {
        console.error("Error setting textareaClicked in storage:", chrome.runtime.lastError);
      } else {
        console.log("textareaClicked flag set to true in chrome.storage.local.");
      }
    });
    // It's good practice to return true if you intend to send a response asynchronously,
    // though in this specific case, we are not sending a response back to the content script.
    // However, to prevent the message port from closing prematurely if we were,
    // and to follow common patterns:
    return true;
  }
});
