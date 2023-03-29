import React, { ChangeEvent, PropsWithChildren } from 'react';
import styles from './slider.module.css';

interface SliderProps extends PropsWithChildren {
    min?: number;
    max?: number;
    value: number;
    onChange: (event: ChangeEvent, ...args: any) => any;
}

function Slider({ min = 0, max = 100, value = 50, onChange, ...props }: SliderProps) {
    return (
        <div className={styles.container}>
            <input
                {...props}
                className={styles.slider}
                type='range'
                min={min}
                max={max}
                value={value}
                onChange={event => onChange(event, { min, max, value: event.target.value })}
            />
        </div>
    );
}

export default Slider;
