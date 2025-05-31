"use strict";

function showInputDialog() {
    if (document.getElementById('sumibi-input-dialog-overlay')) {
        return;
    }
    const overlay = document.createElement('div');
    overlay.id = 'sumibi-input-dialog-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '9999'
    });
    const dialog = document.createElement('div');
    dialog.id = 'sumibi-input-dialog';
    Object.assign(dialog.style, {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        minWidth: '200px'
    });
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.style.marginBottom = '10px';
    dialog.appendChild(inputField);
    const closeButton = document.createElement('button');
    closeButton.textContent = '閉じる';
    closeButton.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    dialog.appendChild(closeButton);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}
console.log("Content script loaded."); // Line 2

document.addEventListener('click', function (event) {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'input' && target.type === 'text') {
        showInputDialog();
        return;
    }
    if (target.tagName.toLowerCase() === 'textarea') {
        console.log("Textarea clicked! Attempting to send message...");

        if (typeof chrome === 'undefined' || typeof chrome.runtime === 'undefined') {
            console.warn('content.js: chrome.runtime is undefined. sendMessage skipped.');
        } else {
            alert('click!');
            chrome.runtime.sendMessage({ type: "textarea_clicked" }, function(response) {
                if (chrome.runtime.lastError) {
                    console.error("content.js: Error sending message:", chrome.runtime.lastError.message);
                } else {
                    console.log("content.js: Message sent successfully. Response:", response);
                }
            });
        }
    }
});
