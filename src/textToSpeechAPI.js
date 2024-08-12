// textToSpeechAPI.js

// Imports the Google Cloud client library
const googleapikey = process.env.REACT_APP_GOOGLE_API_KEY;


// 音声合成
async function textToSpeechAPI() {
  const url = "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + googleapikey;
  const requestbodydata = {
    "input": {
      "text": "ぽにく"
    },
    "voice": {
      "languageCode": "ja-JP",
      "name": "ja-JP-Standard-B"
    },
    "audioConfig": {
      "audioEncoding": "MP3",
      "speaking_rate": "1.00",
      "pitch": "0.00"
    }
  }
  const requestparam = {
    headers: {
      "content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(requestbodydata),
    method: "POST"
  }

  try {
    const response = await fetch(url, requestparam);
    const apiresponse = await response.json();
    const blobUrl = base64ToBlobUrl(apiresponse.audioContent);
    return blobUrl;
  } catch (error) {
    console.log("API呼び出しでエラーが発生しました", error);
    throw error; // Promise の reject にするために例外を再スロー
  }
}

// Base64 → BlobUrl
function base64ToBlobUrl(base64) {
  var bin = atob(base64.replace(/^.*,/, ''));
  var buffer = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
  return window.URL.createObjectURL(new Blob([buffer.buffer], { type: "audio/mpeg" }));
}

export default textToSpeechAPI;
