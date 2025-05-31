"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        // Default message or state
        messageElement.textContent = '...';
    }
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.type === "textarea_clicked") {
            if (messageElement) {
                messageElement.textContent = 'click!';
            }
            // Optional: send a response back to the content script
            // sendResponse({status: "Popup updated"});
        }
        // Keep the message channel open for asynchronous sendResponse if needed, though not used here.
        return true;
    });
});
