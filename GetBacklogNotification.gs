/**
Description:
Backlogの現在のお知らせ件数をSlackに通知するボットちゃん
SlackのOutgoing Webhooksのリクエスト先がこいつ

How to use:
Slackの任意のチャンネルから [xuxui:*] と入力する
*/
function doPost(e) {
  var verify_token = "yMFl374E49UySoNKEtmqi454"
  var channel = e.parameter.channel_id;
  var count = 0;
  
  //投稿の認証
  if (verify_token != e.parameter.token) {
    throw new Error("invalid token.");
  }
  
  objson = getBacklogNotification();
  
  // getContentText()で得られたレスポンスボディ部(文字列)をJavascriptオブジェクト型に変換
  // var objson = JSON.parse(count);
  
  return postToSlack(channel, objson);
}

function getBacklogNotification() {
  var url = "https://dist0mix.backlog.jp/api/v2/notifications/count";
  var apiKey = "tUWfelByrTJf69GJ1yBxrLx0h3tfNgmUM8EiuMC2hQyOYrPOOJMW6nuMf5qNuTC0";
  var requestUrl = url + "?apiKey=" + apiKey;
  
  var response = UrlFetchApp.fetch(requestUrl);
  var responseBody = JSON.parse(response.getContentText());
  
  return responseBody;
}

function postToSlack(channel, objson) {
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var bot_name = "xuxui";
  var bot_icon = "http://i.imgur.com/DP2oyoM.jpg";
  
  var slackApp = SlackApp.create(token);
  
  var postText = objson.count + "　件のお知らせがあるよ～。";
  
  return slackApp.postMessage(channel, postText, {
    username: bot_name,
    icon_url: bot_icon
  });
}