function SendFormDetail(e) {
  // DiscordのウェブフックURL.
  const webhookURL = '任意のウェブフックURLを入れる'; 

  // Discordに表示する文章.
  let messageBody = '';

  messageBody += `会計申請がありました。\n`;
  messageBody += `日時:${e.namedValues['タイムスタンプ'][0]}\n`;
  messageBody += `----------\n`;

  // フォームの内容に応じて変える.
  messageBody += `【申請者名】\n`;
  messageBody += `${e.namedValues['申請者名'][0]}\n\n`;
  messageBody += `【希望購入法】\n`;
  messageBody += `${e.namedValues['希望購入法'][0]}\n\n`;
  messageBody += `【購入品名】\n`;
  messageBody += `${e.namedValues['購入品名'][0]}\n\n`;
  messageBody += `【購入場所】\n`;
  messageBody += `${e.namedValues['購入場所（通販の場合はリンクを入力）'][0]}\n\n`;
  messageBody += `【単価】\n`;
  messageBody += `${e.namedValues['単価（税込・半角）'][0]}\n\n`;
  messageBody += `【個数】\n`;
  messageBody += `${e.namedValues['個数'][0]} `;
  messageBody += `${e.namedValues['個数の単位'][0]}\n\n`;
  messageBody += `【送料など】\n`;
  messageBody += `${e.namedValues['送料など'][0]}\n\n`;
  messageBody += `【備考】\n`;
  messageBody += `${e.namedValues['備考'][0]}\n\n`;
  
  messageBody += `----------\n`;


  const message = {
    'content': messageBody, 
    'tts': false,
  }

  const param = {
    'method': 'POST',
    'headers': { 'Content-type': 'application/json' },
    'payload': JSON.stringify(message)
  }

  UrlFetchApp.fetch(webhookURL, param);
}

function SendOnEdit(e) {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet(); // スプレッドシート
  var activeSheet = activeSpreadsheet.getActiveSheet(); // アクティブシート
  
  if(activeSheet.getName() != '購入申請所'){
    return;
  }
  
  var activeCell = activeSheet.getActiveCell(); // アクティブセル
  var nowInputRow = activeCell.getRow(); // 入力のあった行番号
  var nowInputColumn = activeCell.getColumn(); // 入力のあった列番号
  
  if(nowInputRow <= 1 || nowInputColumn <= 10 || nowInputColumn >= 15){
    // 変更通知対象の範囲外のセルを変更した場合は何もしない
    return;
  }
  // 変更した列名
  var columnName = activeSheet.getRange(1, nowInputColumn).getValues();
  
  //申請日
  //var date = activeSheet.getRange(nowInputRow, 1).getValues();
  
  //申請者
  var name_people = activeSheet.getRange(nowInputRow, 2).getValues();
  //立替か、会計が購入か
  var way = activeSheet.getRange(nowInputRow, 3).getValues();
  //申請した購入物品
  var name_goods = activeSheet.getRange(nowInputRow, 4).getValues();

  var text = "";

  var textMessage = "";
  if(columnName == '会計既読' || columnName == '承認について' || columnName == '現在の状況'){
    activeCellValue = activeCell.getValues();
    if(columnName == '会計既読' && activeCellValue == TRUE){
      text += "会計が申請を確認しました。\n"
    }
    if(columnName == '承認について' && activeCellValue !== ""){
      text += "承認について：" + activeCellValue;
    }
    if(columnName == '現在の状況'){
      text += "現在の状態：" + activeCellValue;
    }
    if(text == "" || name_goods == ""){
    // 通知内容が空の場合は何もしない
    return;
    }
    // 送信するテキスト
    textMessage = "情報が更新されました。\n----------"+"\n【購入品】" + name_goods + "\n【申請者名】"+ name_people + "\n【購入方法】" + way +"\n\n" + text + "\n----------\n" ;
  } 
  sendDiscord(textMessage);

}


function sendDiscord(textMessage){
  if(textMessage == ""){
    // 通知内容が空の場合は何もしない
    return;
  }

  //Webhook URLを設定
  var webHookUrl = '';
  
  var jsonData =
      {
        "content" : textMessage
      };
  
  var payload = JSON.stringify(jsonData);
  
  var options =
      {
        "method" : "post",
        "contentType" : "application/json",
        "payload" : payload,
      };
  
  // リクエスト
  UrlFetchApp.fetch(webHookUrl, options);
}