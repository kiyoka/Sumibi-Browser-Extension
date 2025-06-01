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
    // サイズをターゲットの入力欄に合わせる
    const rect = targetInput.getBoundingClientRect();
    editField.style.width = rect.width + 'px';
    if (targetInput.tagName.toLowerCase() === 'textarea') {
        editField.rows = targetInput.rows || 4;
    } else {
        editField.rows = 1;
    }
    // 高さをターゲットの入力欄に合わせる
    editField.style.height = rect.height + 'px';
    let initialValue;
    if (targetInput.tagName.toLowerCase() === 'div') {
        initialValue = targetInput.textContent ?? '';
    } else {
        initialValue = targetInput.value ?? '';
    }
    editField.value = initialValue;
    dialog.appendChild(editField);
    const convertButton = document.createElement('button');
    convertButton.textContent = '日本語に変換';
    convertButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({type: 'convert_romaji', text: editField.value}, function(response) {
            if (response.success) {
                editField.value = response.result;
            } else {
                console.error(response.error);
                alert('変換中にエラーが発生しました: ' + response.error);
            }
        });
    });
    dialog.appendChild(convertButton);
    const closeButton = document.createElement('button');
    closeButton.textContent = 'クリップボードにコピー';
    closeButton.addEventListener('click', function() {
        navigator.clipboard.writeText(editField.value);
        document.body.removeChild(overlay);
    });
    dialog.appendChild(closeButton);
    dialog.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    overlay.appendChild(dialog);
    overlay.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    document.body.appendChild(overlay);
    editField.focus();
    editField.setSelectionRange(editField.value.length, editField.value.length);
}
console.log("Content script loaded.");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "open_sumibi_dialog") {
        const target = document.activeElement;
        if (
            (target.tagName?.toLowerCase() === 'input' && target.type === 'text') ||
            target.tagName?.toLowerCase() === 'textarea' ||
            (target.tagName?.toLowerCase() === 'div' &&
             target.getAttribute('contenteditable') === 'true')
        ) {
            showInputDialog(target);
        }
    }
});
