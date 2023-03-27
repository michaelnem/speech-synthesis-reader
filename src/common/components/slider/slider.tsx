import { PropsWithChildren } from 'react';
import './slider.css';

type SliderProps = PropsWithChildren<Partial<{ 
    min: number;
    max:number; 
    value:number; 
    handleChange: (...args: any) => any
}>>

function Slider({min=0, max=100, value=50, handleChange, ...props}: SliderProps) {

    return (
        <div className='slide-container'>
            <input
                className='slider'
                type='range'
                min={0}
                max={100}
                value={value}
                onChange={handleChange}
                id='myRange'
            />
        </div>
    );
}

export default Slider;
