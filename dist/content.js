"use strict";
function showInputDialog(targetInput) {
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
    const editField = document.createElement('textarea');
    editField.style.marginBottom = '10px';
    editField.style.width = '100%';
    if (targetInput.tagName.toLowerCase() === 'textarea') {
        editField.rows = targetInput.rows || 4;
        editField.style.height = '100px';
    }
    else {
        editField.rows = 1;
    }
    editField.value = targetInput.value;
    dialog.appendChild(editField);
    const closeButton = document.createElement('button');
    closeButton.textContent = 'クリップボードにコピー';
    closeButton.addEventListener('click', function () {
        navigator.clipboard.writeText(editField.value);
        document.body.removeChild(overlay);
    });
    dialog.appendChild(closeButton);
    dialog.addEventListener('click', function (event) {
        event.stopPropagation();
    });
    overlay.appendChild(dialog);
    overlay.addEventListener('click', function () {
        document.body.removeChild(overlay);
    });
    document.body.appendChild(overlay);
    editField.focus();
    editField.setSelectionRange(editField.value.length, editField.value.length);
}
console.log("Content script loaded.");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    var _a, _b;
    if (request.type === "open_sumibi_dialog") {
        const target = document.activeElement;
        if ((((_a = target.tagName) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'input' && target.type === 'text') ||
            ((_b = target.tagName) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'textarea') {
            showInputDialog(target);
        }
    }
});
