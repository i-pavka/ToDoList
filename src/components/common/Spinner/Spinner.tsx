import React from 'react';
import s from './Spinner.module.css'

export const Spinner = () => {
    return (
        <div className={s.mainBlock}>
            <div className={s.container}>
                <div className={s.speedingWheel}></div>
            </div>
        </div>

    );
};

