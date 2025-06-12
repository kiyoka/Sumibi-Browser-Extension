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
  if (request.type === "convert_romaji") {
    chrome.storage.local.get(['openai_api_key', 'openai_model'], function(result) {
      const apiKey = result.openai_api_key;
      if (!apiKey) {
        sendResponse({ success: false, error: 'OpenAI APIキーが設定されていません。設定画面でAPIキーを入力してください。' });
        return;
      }
      const model = result.openai_model || 'gpt-4.1';
      const roman = request.roman;
      const surrounding = request.surrounding || '';
      const messages = [
        { role: "system", content:
            "あなたはローマ字とひらがなを日本語に変換するアシスタントです。" +
            "ローマ字の 「nn」 は 「ん」と読んでください。" +
            "[](URL)のようなmarkdown構文は維持してください。" +
            "# や ## や ### や #### のようなmarkdown構文は維持してください。" +
            "ローマ字とひらがなの文を漢字仮名混じり文にしてください。" +
            "ローマ字の字面をそのままひらがなや漢字にするだけで、元のローマ字にない文章を作り出さないでください。" +
            "出力は変換後の一文のみ。注釈や説明は一切付けないください。" +
            "もし、入力された文章が英語の文章と判断できた場合は、日本語に翻訳してください。"
        },
        { role: "user", content:
            "ローマ字とひらがなの文を漢字仮名混じり文にしてください。" +
            " 周辺の文章は、「こんにちは、中野です。watashi no namae ha nakano desu . どうぞよろしくお願いします。」のような文章になっています。" +
            "周辺の文脈を見てそれに合った語彙を選んでください。: watashi no namae ha nakano desu ."
        },
        { role: "assistant", content: "私の名前は中野です。" },
        { role: "user", content:
            "ローマ字とひらがなの文を漢字仮名混じり文にしてください。" +
            "周辺の文章は、「説明はここまでです。それ以外はikano toori desu .」のような文章になっています。" +
            "周辺の文脈を見てそれに合った語彙を選んでください。: ikano toori desu ."
        },
        { role: "assistant", content: "以下の通りです。" },
        { role: "user", content:
            "ローマ字とひらがなの文を漢字仮名混じり文にしてください。" +
            "周辺の文章は、「開始位置から終了位置までをhannishitei shimasuそれでは続いて、」のような文章になっています。" +
            "周辺の文脈を見てそれに合った語彙を選んでください。: hannishitei shimasu"
        },
        { role: "assistant", content: "範囲指定します" },
        { role: "user", content:
            "ローマ字とひらがなの文を漢字仮名混じり文にしてください。" +
            "周辺の文章は、「見てください!We succeeded in taking a photo like this:\n![example](https://www.example.com/dir1/dir2/example.png)、" +
            "リアルな写真だと思いませんか？」のような文章になっています。" +
            "周辺の文脈を見てそれに合った語彙を選んでください。: We succeeded in taking a photo like this:\n![example](https://www.example.com/dir1/dir2/example.png)"
        },
        { role: "assistant", content:
            "このような写真を撮ることに成功しました：\n![例](https://www.example.com/dir1/dir2/example.png)"
        },
        { role: "user", content:
            "ローマ字とひらがなの文を漢字仮名混じり文にしてください。周辺の文章は、「ここまでが前半の説明です。\n## this is markdown section\n\n」" +
            "のような文章になっています。周辺の文脈を見てそれに合った語彙を選んでください。: ## this is markdown section"
        },
        { role: "assistant", content: "## これはMarkdownのセクションです。" },
        { role: "user", content:
            "ローマ字とひらがなの文を漢字仮名混じり文にしてください。周辺の文章は、「" + surrounding + "」" +
            "のような文章になっています。周辺の文脈を見てそれに合った語彙を選んでください。: " + roman
        }
      ];
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey
        },
        body: JSON.stringify({ model: model, messages: messages })
      })
        .then(response => response.json())
        .then(data => {
          const resultText = data.choices?.[0]?.message?.content?.trim() ?? "";
          sendResponse({ success: true, result: resultText });
        })
        .catch(error => sendResponse({ success: false, error: error.toString() }));
    });
    return true;
  }
});
