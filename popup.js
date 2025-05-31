"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        // Default message or state
        messageElement.textContent = '...';
    }

    // Check storage for the textareaClicked flag
    chrome.storage.local.get(['textareaClicked'], function(result) {
        if (chrome.runtime.lastError) {
            console.error("Error getting textareaClicked from storage:", chrome.runtime.lastError);
            return;
        }

        if (result.textareaClicked) {
            console.log("Popup: textareaClicked flag is true. Setting message to 'click!'.");
            if (messageElement) {
                messageElement.textContent = 'click!';
            }
            // Reset the flag in storage
            chrome.storage.local.set({ textareaClicked: false }, function() {
                if (chrome.runtime.lastError) {
                    console.error("Error resetting textareaClicked in storage:", chrome.runtime.lastError);
                } else {
                    console.log("Popup: textareaClicked flag reset to false.");
                }
            });
        } else {
            console.log("Popup: textareaClicked flag is false or not set.");
        }
    });
});
