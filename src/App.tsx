/// <reference lib="dom" />
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import './App.css';
import Slider from './common/components/slider/slider';
import { Interpolation } from './common/utils/interpolation.util';
import { useEventListener } from './common/utils/use-event-listener.util';



function App() {
    const ref: MutableRefObject<HTMLTextAreaElement | null> = useRef(null);
    const [textToRead, setTextToRead] = useState('');
    const [voices, setVoices] = useState<any[]>([]);
    const [activeVoice, setActiveVoice] = useState<SpeechSynthesisVoice>();
    const [rate, setRate] = useState(50);
    const [speaking, setSpeaking] = useState(false);
    const utterance = useRef(new SpeechSynthesisUtterance());
    const synth = useRef<SpeechSynthesis>(window.speechSynthesis);


    useEventListener('boundary', HandleEventRef({cb: handleBoundary, log: true}), utterance.current.onboundary);
    useEventListener('mark', HandleEventRef(), utterance.current);
    useEventListener('start', HandleEventRef({log: true}), utterance.current);
    useEventListener('pause', HandleEventRef(), utterance.current);
    useEventListener('resume', HandleEventRef(), utterance.current);
    useEventListener('end', HandleEventRef(), utterance.current);
    useEventListener('error', HandleEventRef(), utterance.current);
    useEventListener('voiceschanged', HandleEventRef({cb: handleVoicesChanged, log: true}), synth.current);

    useEffect(() => {
        const loadedVoices = synth.current.getVoices();
        
        loadedVoices.length && handleVoicesChanged();
    }, [utterance, synth]);


    function HandleEventRef({cb = (event) => event, log = false}: {cb?: (event: Event) => any; log?:boolean} = {}) {
        return (event: Event) => {
            const result = cb(event);
            log && console.log(event.type, result);
        };
    }

    function handleBoundary(event: Event) {
        const {name, charIndex, charLength} = event as SpeechSynthesisEvent;
        if (name === 'word') {
            const reading = textToRead.substring(charIndex, charIndex + charLength);
            return reading;
        }
        return event;
    }

    function handleVoicesChanged () {
        const voices = synth.current.getVoices();
        if (activeVoice || !voices) {
            return;
        }
        const defaultVoice = voices.find(voice => voice.default);
        defaultVoice && setActiveVoice(defaultVoice);
        setVoices(synth.current.getVoices());
        return voices;
    }


    const handleMessageChange = (event: any) => {
        setTextToRead(event.target.value);
    };

    const handleRateChange = ({ target }: any) => {
        // console.log(target?.value);
        setRate(target?.value);
    };

    const handleCancelClick = () => {
        synth.current.cancel();
    };

    const handleReadClick = () => {
        utterance.current.text = textToRead;
        utterance.current.lang = activeVoice?.lang || '';
        utterance.current.voice = activeVoice || null;
        utterance.current.rate = Interpolation.lerp(0, 2, Interpolation.normalize(0, 100, rate));

        synth.current.speak(utterance.current);
    };

    const handleVoiceClick = (voice: SpeechSynthesisVoice) => {
        setActiveVoice(voice);
    };

    return (
        <div className='speech-synthesis-reader'>
            <div className='textarea-container'>
                <textarea className='textarea' ref={ref} value={textToRead} onChange={handleMessageChange} />
            </div>
            <div>
                <span>Speed {rate}</span>
                <Slider value={rate} handleChange={handleRateChange} />
            </div>
            <button onClick={handleCancelClick}>cancel</button>
            <button onClick={handleReadClick}>read</button>
            <ul>
                {voices?.map(voice => (
                    <li
                        key={voice.name}
                        data-lang={voice.lang}
                        className={`voice${voice === activeVoice ? ' active' : ''}`}
                        onClick={() => handleVoiceClick(voice)}>
                        {voice.name} - ({voice.lang}) - {voice.voiceURI}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
