const message = document.getElementById('message'); // セリフの入力エリア
const playButton = document.getElementById('play'); // 再生ボタン
const voiceSelect = document.getElementById('voiceSelect'); // 音声選択ボタン

// 音声一覧をセレクトボックスに追加する関数
const addVoiceList = () => {
  const voiceList = speechSynthesis.getVoices();

  for (let i=0; i<voiceList.length; i++) {
    // 日本語の音声以外はスキップ
    if (!voiceList[i].lang.startsWith('ja')) continue;

    // selectタグ内の選択肢として、optionタグを新たに作成
    const newOption = document.createElement('option');

    // optionタグのテキストに音声の名称を設定
    newOption.value = voiceList[i].voiceURI;
    newOption.text = voiceList[i].name;

    // デフォルトの音声の場合、選択済みにする
    newOption.selected = voiceList[i].default;

    // selectの選択肢として追加
    voiceSelect.appendChild(newOption);
  }
}

// 音声一覧をセレクトボックスに追加する関数を実行
addVoiceList();

// 選択できる音声の種類が変わった場合
speechSynthesis.onvoiceschanged = (e) => {
  // 一度select内のoptionをすべて削除
  while (voiceSelect.firstChild) {
    voiceSelect.removeChild(voiceSelect.firstChild);
  }
  // 再度音声一覧を追加
  addVoiceList();
}

// 再生ボタンをクリックしたとき、選択した音声で再生
const callWebSpeechApi = () => {
  const uttr = new SpeechSynthesisUtterance(message.value);
  uttr.lang = 'ja-JP';
  // 選択した音声を使用
  uttr.voice = speechSynthesis
      .getVoices()
      .filter((voice) => voice.voiceURI === voiceSelect.value)[0];
  speechSynthesis.speak(uttr);
};

export default callWebSpeechApi;
