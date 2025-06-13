"use strict";

function showInputDialog(targetInput) {
    if (document.getElementById('sumibi-input-dialog-overlay')) {
        return;
    }
    const overlay = document.createElement('div');
    overlay.id = 'sumibi-input-dialog-overlay';
    // スタイルは content.css で定義 (#sumibi-input-dialog-overlay)
    const dialog = document.createElement('div');
    dialog.id = 'sumibi-input-dialog';
    // スタイルは content.css で定義 (#sumibi-input-dialog)
    const editField = document.createElement('textarea');
    // スタイルは content.css で定義 (textarea の margin-bottom)
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
    // ダイアログ位置は JS で動的設定
    const computed = window.getComputedStyle(dialog);
    const padding = parseInt(computed.paddingTop, 10) || 0;
    dialog.style.top  = (rect.top + window.scrollY - padding) + 'px';
    dialog.style.left = (rect.left + window.scrollX - padding) + 'px';
    let initialValue;
    if (targetInput.tagName.toLowerCase() === 'div') {
        initialValue = targetInput.textContent ?? '';
    } else {
        initialValue = targetInput.value ?? '';
    }
    editField.value = initialValue;
    dialog.appendChild(editField);
    const skipCharsRegex = /[-a-zA-Z0-9.,@:`\\+!\[\]\?;'\t ]/;

    function doConvert() {
        const text = editField.value;
        const cursorPos = editField.selectionStart || 0;
        let start = cursorPos;
        while (start > 0 && skipCharsRegex.test(text.charAt(start - 1))) start--;
        const roman = text.substring(start, cursorPos);
        const surrounding = text;
        if (!roman) return;
        chrome.runtime.sendMessage(
            { type: 'convert_romaji', roman, surrounding },
            function(response) {
                if (response.success) {
                    const resultText = response.result;
                    const newText = text.substring(0, start) + resultText + text.substring(cursorPos);
                    editField.value = newText;
                    const newPos = start + resultText.length;
                    editField.setSelectionRange(newPos, newPos);
                } else {
                    console.error(response.error);
                    alert('変換中にエラーが発生しました: ' + response.error);
                }
            }
        );
    }
    const closeButton = document.createElement('button');
    const tagName = targetInput.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea') {
        closeButton.textContent = '反映';
        closeButton.addEventListener('click', function() {
            targetInput.value = editField.value;
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', _sumibiOnKeyDown);
        });
    } else {
        closeButton.textContent = 'クリップボードにコピー';
        closeButton.addEventListener('click', function() {
            navigator.clipboard.writeText(editField.value);
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', _sumibiOnKeyDown);
        });
    }
    closeButton.classList.add('apply-btn');
    dialog.appendChild(closeButton);

    const cancelButton = document.createElement('button');
    cancelButton.textContent = '×';
    cancelButton.classList.add('cancel-btn');
    cancelButton.addEventListener('click', function(e) {
        e.stopPropagation();
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', _sumibiOnKeyDown);
    });
    dialog.appendChild(cancelButton);
    function _sumibiOnKeyDown(e) {
        if (!document.getElementById('sumibi-input-dialog-overlay')) {
            document.removeEventListener('keydown', _sumibiOnKeyDown);
            return;
        }
        if (e.key === 'j' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            doConvert();
        }
    }
    document.addEventListener('keydown', _sumibiOnKeyDown);
    dialog.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    overlay.appendChild(dialog);
    overlay.addEventListener('click', function() {
        const tag = targetInput.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea') {
            targetInput.value = editField.value;
        } else if (tag === 'div') {
            if (editField.value !== initialValue) {
                navigator.clipboard.writeText(editField.value);
                alert('クリップボードにコピーしました');
            }
        }
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', _sumibiOnKeyDown);
    });
    document.body.appendChild(overlay);
    editField.focus();
    editField.setSelectionRange(editField.value.length, editField.value.length);
    editField.addEventListener('input', function() {
        const pos = this.selectionStart || 0;
        if (pos >= 2 && this.value.substring(pos - 2, pos) === '  ') {
            doConvert();
        }
    });
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

document.addEventListener('keydown', function(e) {
    if (e.key === 'j' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
        if (document.getElementById('sumibi-input-dialog-overlay')) return;
        const target = document.activeElement;
        const tag = target.tagName?.toLowerCase();
        if ((tag === 'input' && target.type === 'text') ||
            tag === 'textarea' ||
            (tag === 'div' && target.getAttribute('contenteditable') === 'true')) {
            e.preventDefault();
            showInputDialog(target);
        }
    }
});
