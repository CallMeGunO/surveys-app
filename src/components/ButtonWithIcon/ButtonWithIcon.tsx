import React, { ButtonHTMLAttributes } from 'react'

import styles from './ButtonWithIcon.css'

interface ButtonWithIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode
    children?: React.ReactNode
}

const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({ icon, children, onClick }) => {
    return (
        <button className={styles.container} onClick={onClick}>
            <span className={styles.icon}>{icon}</span>
            <span className={styles.text}>{children}</span>
        </button>
    )
}

export default ButtonWithIcon
