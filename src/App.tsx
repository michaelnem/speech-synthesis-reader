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
    // if ( 'speechSynthesis' in window ) {
    //     var to_speak = new SpeechSynthesisUtterance('Hello, world!');
    //     window.speechSynthesis.speak(to_speak);
    //   } 
    const utterance = useRef(new SpeechSynthesisUtterance());
    const synth = useRef<SpeechSynthesis>(window.speechSynthesis);

    useEventListener('boundary', handleBoundary, utterance.current);
    useEventListener('voiceschanged', handleVoicesChanged, synth.current);

    useEffect(() => {
        const loadedVoices = synth.current.getVoices();
        
        loadedVoices.length && handleVoicesChanged();
    }, [utterance, synth]);



    function handleBoundary({name, charIndex, charLength}: any) {
        if (name === 'word') {
            const reading = textToRead.substring(charIndex, charIndex + charLength);
            console.log(reading);
        }
    }

    function handleVoicesChanged () {
        const voices = synth.current.getVoices();
        if (activeVoice || !voices) {
            return;
        }
        const defaultVoice = voices.find(voice => voice.default);
        defaultVoice && setActiveVoice(defaultVoice);
        setVoices(synth.current.getVoices());
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
        utterance.current.voice = activeVoice || null;
        utterance.current.rate = Interpolation.lerp(1, 2, Interpolation.normalize(0, 100, rate));

        synth.current.speak(utterance.current);
    };

    const handleVoiceClick = (voice: SpeechSynthesisVoice) => {
        // console.log(voice);
        setActiveVoice(voice);
    };

    return (
        <div className='speech-synthesis-reader'>
            <textarea className='textarea' ref={ref} value={textToRead} onChange={handleMessageChange} />
            <Slider value={rate} handleChange={handleRateChange} />
            <button onClick={handleCancelClick}>cancel</button>
            <button onClick={handleReadClick}>read</button>
            <ul>
                {voices?.map(voice => (
                    <li
                        key={voice.name}
                        className={`voice${voice === activeVoice ? ' active' : ''}`}
                        onClick={() => handleVoiceClick(voice)}>
                        {voice.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
