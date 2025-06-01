// background.js
console.log("Background script loaded.");

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sumibi-edit",
    title: "Edit with Sumibi",
    contexts: ["editable"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sumibi-edit" && tab.id) {
    chrome.tabs.sendMessage(tab.id, { type: "open_sumibi_dialog" });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "textarea_clicked") {
    console.log("Background script received textarea_clicked message.");
    chrome.storage.local.set({ textareaClicked: true }, function() {
      if (chrome.runtime.lastError) {
        console.error("Error setting textareaClicked in storage:", chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log("textareaClicked flag set to true in chrome.storage.local.");
        sendResponse({ success: true });
      }
    });
    return true;
  } else if (request.type === "convert_romaji") {
    chrome.storage.local.get(['openai_api_key', 'openai_model'], function(result) {
      const apiKey = result.openai_api_key;
      if (!apiKey) {
        sendResponse({ success: false, error: 'OpenAI APIキーが設定されていません。設定画面でAPIキーを入力してください。' });
        return;
      }
      const model = result.openai_model || 'gpt-4.1';
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: "You are a helpful assistant converting romanized Japanese to proper Japanese text." },
            { role: "user", content: request.text }
          ]
        })
      })
        .then(response => response.json())
        .then(data => {
          const resultText =
            data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
              ? data.choices[0].message.content.trim()
              : "";
          sendResponse({ success: true, result: resultText });
        })
        .catch(error => sendResponse({ success: false, error: error.toString() }));
    });
    return true;
  }
});
