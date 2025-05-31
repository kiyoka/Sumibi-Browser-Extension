"use strict";
console.log("Content script loaded."); // Line 2

document.addEventListener('click', function (event) {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'textarea') {
        console.log("Textarea clicked! Attempting to send message..."); // Line 6 (updated log)
        
        if (typeof chrome === 'undefined' || typeof chrome.runtime === 'undefined') {
            console.warn('content.js: chrome.runtime is undefined. sendMessage skipped.');
        } else {
            chrome.runtime.sendMessage({ type: "textarea_clicked" }, function(response) {
            if (chrome.runtime.lastError) {
                console.error("content.js: Error sending message:", chrome.runtime.lastError.message); // Changed to console.error for visibility
            } else {
                console.log("content.js: Message sent successfully. Response:", response);
            }
            });
        }
    }
});
