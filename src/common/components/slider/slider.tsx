import React, { ChangeEvent, PropsWithChildren } from 'react';
import './slider.css';

interface SliderProps extends PropsWithChildren {
    min?: number;
    max?: number;
    value: number;
    handleChange: (event: ChangeEvent, ...args: any) => any;
}

function Slider({ min = 0, max = 100, value = 50, handleChange, ...props }: SliderProps) {
    return (
        <div className='slide-container'>
            <input
                {...props}
                className='slider'
                type='range'
                min={min}
                max={max}
                value={value}
                onChange={event => handleChange(event, { min, max, value: event.target.value })}
            />
        </div>
    );
}

export default Slider;
