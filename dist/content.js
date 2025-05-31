"use strict";
console.log("Content script loaded.");
document.addEventListener('click', function (event) {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'textarea') {
        console.log("Textarea clicked!");
        // Send a message to the popup or background script
        // In this simple case, the manifest's action.default_popup handles opening popup.html
        // We just need to ensure the popup itself knows to display "click!".
        // For simplicity, we'll have the popup script check for a condition or listen for an event.
        // A more robust way for complex interactions would be chrome.runtime.sendMessage.
        // However, for a simple "show 'click!'" on popup open after a textarea click,
        // the popup can just display "click!" directly, assuming the click was the trigger.
        // Let's refine this: the content script *will* send a message.
        chrome.runtime.sendMessage({ type: "textarea_clicked" });
    }
});
