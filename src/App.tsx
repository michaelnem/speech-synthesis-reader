/// <reference lib="dom" />
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop } from '@fortawesome/free-solid-svg-icons';
import { Interpolation } from './common/utils/interpolation.util';
import { useEventListener } from './common/utils/use-event-listener.util';
import Slider from './common/components/slider/slider';
import IconButton from './common/components/icon-button/icon-button';
import Wrap from './common/components/wrap/wrap';

if (!('SpeechSynthesisUtterance' in window)) {
    (window as any).SpeechSynthesisUtterance = function () {};
    (window as any).speechSynthesis = { getVoices: () => [] };
}

interface Option {
    value: any;
    label: string;
}

interface VoiceOptions extends Option {
    value: SpeechSynthesisVoice;
}

function App() {
    const ref: MutableRefObject<HTMLTextAreaElement | null> = useRef(null);
    const [textToRead, setTextToRead] = useState('');
    const [voicesOptions, setVoicesOptions] = useState<VoiceOptions[]>([]);
    const [activeVoice, setActiveVoice] = useState<VoiceOptions>();
    const [rate, setRate] = useState(50);
    const [volume, setVolume] = useState(100);
    // const [speaking, setSpeaking] = useState(false);
    const utteranceRef = useRef(new SpeechSynthesisUtterance());
    const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

    useEventListener('boundary', HandleEventRef({ cb: handleBoundary, log: true }), utteranceRef.current);
    useEventListener('mark', HandleEventRef(), utteranceRef.current);
    useEventListener('start', HandleEventRef({ log: true }), utteranceRef.current);
    useEventListener('pause', HandleEventRef(), utteranceRef.current);
    useEventListener('resume', HandleEventRef(), utteranceRef.current);
    useEventListener('end', HandleEventRef(), utteranceRef.current);
    useEventListener('error', HandleEventRef(), utteranceRef.current);
    useEventListener('voiceschanged', HandleEventRef({ cb: handleVoicesChanged, log: true }), synthRef.current);

    useEffect(() => {
        const loadedVoices = synthRef.current.getVoices();

        loadedVoices.length && handleVoicesChanged();
    }, [utteranceRef, synthRef]);

    useEffect(() => {

    }, [rate, volume]);

    function HandleEventRef({ cb = event => event, log = false }: { cb?: (event: Event) => any; log?: boolean } = {}) {
        return (event: Event) => {
            const result = cb(event);
            log && console.log(event.type, result);
        };
    }

    function handleBoundary(event: Event) {
        const { name, charIndex, charLength } = event as SpeechSynthesisEvent;
        if (name === 'word') {
            const reading = textToRead.substring(charIndex, charIndex + charLength);
            return reading;
        }
        return event;
    }

    function handleVoicesChanged() {
        const voices = synthRef.current.getVoices();
        if (activeVoice || !voices) {
            return;
        }
        const defaultVoice = voices.find(voice => voice.default);
        defaultVoice && setActiveVoice({ value: defaultVoice, label: getVoiceOptionLabel(defaultVoice) });
        setVoicesOptions(voices.map(voice => ({ value: voice, label: getVoiceOptionLabel(voice) })));
        return voices;
    }

    const getVoiceOptionLabel = (voice: SpeechSynthesisVoice): string => {
        return `${voice.name} - (${voice.lang}) - ${voice.voiceURI}`;
    };

    const handleMessageChange = (event: any) => {
        setTextToRead(event.target.value);
    };

    const handleRateChange = ({ target }: any) => setRate(target?.value);

    const handleVolumeChange = ({ target }: any) => setVolume(target?.value);

    const handleCancelClick = () => {
        synthRef.current.cancel();
    };

    const handleReadClick = () => {
        utteranceRef.current.text = textToRead;
        utteranceRef.current.lang = activeVoice?.value?.lang || '';
        utteranceRef.current.voice = activeVoice?.value || null;
        utteranceRef.current.rate = Interpolation.lerp(0, 2, Interpolation.normalize(0, 100, rate));
        utteranceRef.current.volume = Interpolation.lerp(0, 1, Interpolation.normalize(0, 100, volume));

        synthRef.current.speak(utteranceRef.current);
    };

    const handleVoiceClick = (voiceOption: SingleValue<VoiceOptions>) => {
        if (!voiceOption) {
            return;
        }
        setActiveVoice({ value: voiceOption.value, label: getVoiceOptionLabel(voiceOption.value) });
    };

    return (
        <div className='speech-synthesis-reader'>
            <div className='textarea-container'>
                <textarea className='textarea' ref={ref} value={textToRead} onChange={handleMessageChange} />
            </div>
            <div className='reader-controller'>
                <IconButton onClick={handleCancelClick}>
                    <FontAwesomeIcon icon={faStop} />
                </IconButton>
                {/* faPause */}
                <IconButton onClick={handleReadClick}>
                    <div className='play-btn-icon'>
                        <FontAwesomeIcon icon={faPlay} />
                    </div>
                </IconButton>
            </div>
            <Wrap>
                <span>Speed {rate}</span>
                <Slider value={rate} onChange={handleRateChange} />
            </Wrap>
            <Wrap>
                <span>Volume {volume}%</span>
                <Slider value={volume} onChange={handleVolumeChange} />
            </Wrap>
            <Wrap>
                <Select options={voicesOptions} value={activeVoice} onChange={handleVoiceClick}></Select>
            </Wrap>
        </div>
    );
}

export default App;
