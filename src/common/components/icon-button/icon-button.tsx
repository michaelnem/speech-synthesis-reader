import React, { MouseEvent, PropsWithChildren } from 'react';
import styles from './icon-button.module.css';

interface IconButtonProps extends PropsWithChildren {
    size?: 'sm' | 'md' | 'lg';
    onClick: (event: MouseEvent, ...args: any) => any;
}

function IconButton({size = 'sm', onClick, children}: IconButtonProps) {
    return (
        <button className={styles.iconBtn} onClick={onClick}>
            <div className={styles.iconBtnContent} >{children}</div>
        </button>
    );
}

export default IconButton;
