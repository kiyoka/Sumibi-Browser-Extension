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
    } else {
        editField.rows = 1;
    }
    editField.value = targetInput.value;
    dialog.appendChild(editField);
    const closeButton = document.createElement('button');
    closeButton.textContent = '閉じる';
    closeButton.addEventListener('click', function() {
        targetInput.value = editField.value;
        document.body.removeChild(overlay);
    });
    dialog.appendChild(closeButton);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}
console.log("Content script loaded."); // Line 2

document.addEventListener('click', function (event) {
    const target = event.target;
    if ((target.tagName.toLowerCase() === 'input' && target.type === 'text') ||
        target.tagName.toLowerCase() === 'textarea') {
        showInputDialog(target);
        return;
    }
});
