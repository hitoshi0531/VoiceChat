// AISpeak.js
import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import CallGptApi from "./CallGptApi";

const AISpeak = () => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    const [gptOut, setGptOut] = useState("");
    const [toggleButtonText, setToggleButtonText] = useState("Click to speak");
    const [recognitionState, setRecognitionState] = useState("");

    // スライダーの値を保持するstate
    const [speechSpeed, setSpeechSpeed] = useState(1);
    const [speechPitch, setSpeechPitch] = useState(1);
    const [responseTemperature, setResponseTemperature] = useState(1);

    // 言語と音声有無のstate
    const [language, setLanguage] = useState('en');
    const [audioState, setAudioState] = useState('ON');
    
    // useRef を null で初期化
    const voiceSelect = useRef();

    useEffect(() => {
        if (listening === false && recognitionState === "recognized") {
            handleGpt(transcript);
            setRecognitionState("waiting");
        }
    }, [recognitionState]);

    useEffect(() => {
        // fetchAndAddVoiceList を実行
        fetchAndAddVoiceList();
    }, [language]);

    useEffect(() => {
        handleTextToSpeech(gptOut);
    }, [gptOut]);

    if (!browserSupportsSpeechRecognition) {
        return <span>ブラウザは音声認識をサポートしていません。</span>;
    }

    const handleGpt = async () => {
        try {
            const result = await CallGptApi({
                transcript,
                language,
                responseTemperature});
            await setGptOut(result);
        } catch (error) {
            console.error("GPTの呼び出しでエラーが発生しました:", error);
        }
    };

    const handleStartListening = () => {
        if (language === 'en'){
            SpeechRecognition.startListening({ language: 'en-UK', continuous: true });
        } else {
            SpeechRecognition.startListening({ language: 'ja-JP', continuous: true });
        }
        setToggleButtonText("Click to stop");
        setRecognitionState("recognizing");
        resetTranscript();
    };

    const handleStopListening = () => {
        SpeechRecognition.stopListening();
        setToggleButtonText("Click to speak");
        setRecognitionState("recognized");
    };

    const toggleStartStopListening = async () => {
        if (listening === false) {
            handleStartListening();
        } else {
            handleStopListening();
        }
    };

    const resetResponse = () => {
        setGptOut("");
        speechSynthesis.cancel();
    };

    const handleTextToSpeech = (gptOut) => {
        try {
            const uttr = new SpeechSynthesisUtterance(gptOut);

            uttr.lang = speechSynthesis
                .getVoices()
                .filter((lang) => lang.lang === voiceSelect.current.value)[0];

                // 選択した音声を使用
            uttr.voice = speechSynthesis
                .getVoices()
                .filter((voice) => voice.voiceURI === voiceSelect.current.value)[0];

            // スライダーの値を引数として設定
            uttr.rate = speechSpeed;
            uttr.pitch = speechPitch;
            // Utteranceのspeakメソッドを実行
            speechSynthesis.speak(uttr);
        } catch (error) {
            console.log("テキストの再生でエラーが発生しました", error);
        }
    }

    // 音声一覧をセレクトボックスに追加する関数
    const addVoiceList = (voiceList) => {
        try {
            if (!voiceSelect.current) {
                console.error("voiceSelect is not defined.");
                return;
            }
            // セレクトボックスをクリア
            voiceSelect.current.innerHTML = '';

            if (language === 'en'){
                for (let i = 0; i < voiceList.length; i++) {
                    // 英語の音声以外はスキップ
                    if (voiceList[i].lang.startsWith('en')) {
                        const newOption = document.createElement('option');
                        newOption.value = voiceList[i].voiceURI;
                        newOption.text = voiceList[i].name;
                        newOption.selected = voiceList[i].default;
                        voiceSelect.current.appendChild(newOption);
                    }
                }
            } else {
                for (let i = 0; i < voiceList.length; i++) {
                    // 日本語の音声以外はスキップ
                    if (voiceList[i].lang.startsWith('ja')) {
                        const newOption = document.createElement('option');
                        newOption.value = voiceList[i].voiceURI;
                        newOption.text = voiceList[i].name;
                        newOption.selected = voiceList[i].default;
                        voiceSelect.current.appendChild(newOption);
                    }
                }
            }
        } catch (error) {
            console.error("音声リストの追加中にエラーが発生しました:", error);
        }
    };


    // 新たに非同期関数を作成して、voiceList の取得と addVoiceList の実行を待つ
    const fetchAndAddVoiceList = async () => {
        try {
            const voiceList = await getVoiceList();
            addVoiceList(voiceList);
        } catch (error) {
            console.error("音声リストの取得中にエラーが発生しました:", error);
        }
    };
   
    // 非同期で voiceList を取得する関数
    const getVoiceList = () => {
        return new Promise((resolve) => {
            const voices = speechSynthesis.getVoices();
            if (voices.length) {
                resolve(voices);
            } else {
                // voices が取得できない場合は onvoiceschanged イベントを待つ
                speechSynthesis.onvoiceschanged = () => {
                    resolve(speechSynthesis.getVoices());
                };
            }
        });
    };


    return (
        <div>
            <section className="listeningState">Listening state: {listening ? 'Listening' : 'Not listening'}</section>
            <section className="buttonSection">
                <button onClick={toggleStartStopListening} id="toggleButtonText">{toggleButtonText}</button>
                <button onClick={() => { resetTranscript(); resetResponse(); }} id="resetButton">Reset</button>
            </section>
            <section className="recognisedTextSection">
                <span>Recognised: {transcript}</span>
            </section>
            <section className="responsedTextSection">
                <span>Responsed: {gptOut}</span>
            </section>
            <section className="getSpeech">
                <button onClick={() => {handleTextToSpeech(gptOut);}}>Repeat Speech</button>
            </section>
            <section className="audioSwitchSection">
                <label className="audioSwitchLabel">
                    <input
                        type="checkbox"
                        onChange={() => setAudioState(audioState === 'ON' ? 'OFF' : 'ON')}
                    />
                    <span className="audioSwitch"></span>
                </label>
                <span className="audioSwitchValue">Audio: {audioState === 'ON' ? 'ON' : 'OFF'}</span>
            </section>
            <section className="languageSwitchSection">
                <label className="languageSwitchLabel">
                    <input
                        type="checkbox"
                        onChange={() => setLanguage(language === 'en' ? 'ja' : 'en')}
                    />
                    <span className="languageSwitch"></span>
                </label>
                <span className="languageSwitchValue">Language: {language === 'en' ? 'English' : 'Japanese'}</span>
            </section>
            <section className="speechVoiceOption">
                <label className="label" htmlFor="voiceSelect">Response Voice</label>
                <select className="voiceSelect" ref={voiceSelect}></select>
            </section>
            <section className="speechSpeedOption">
                <label className="label" htmlFor="response_speech_speed">Response speech speed (default: 1)</label>
                <input
                    type="range"
                    id="response_speech_speed"
                    className="response_speech_speed"
                    min="0.1"
                    max="10.0"
                    step="0.1"
                    value={speechSpeed}
                    onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                />
                <output>{speechSpeed}</output>
            </section>
            <section className="speechPitchOption">
                <label className="rangeLabel" htmlFor="response_speech_pitch">Response speech pitch (default: 1)</label>
                <input
                    type="range"
                    id="response_speech_pitch"
                    className="response_speech_pitch"
                    min="0"
                    max="2.0"
                    step="0.1"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                />
                <output>{speechPitch}</output>
            </section>
            <section className="responseTemperatureOption">
                <label className="rangeLabel" htmlFor="response_temperature">Response creativity (default: 1)</label>
                <input
                    type="range"
                    id="response_temperature"
                    className="response_temperature"
                    min="0"
                    max="2.0"
                    step="0.1"
                    value={responseTemperature}
                    onChange={(e) => setResponseTemperature(parseFloat(e.target.value))}
                />
                <output>{responseTemperature}</output>
            </section>

        </div>
    );
};

export default AISpeak;
