import React, { PropsWithChildren } from 'react';
import styles from './wrap.module.css';

interface WrapProps extends PropsWithChildren {
}

function Wrap({ children }: WrapProps) {
    return (
        <div className={styles.wrap}>
            {children}
        </div>
    );
}

export default Wrap;
