import React from 'react'

import styles from './PageHeader.css'

interface PageHeaderProps {
    children: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({ children }) => {
    return <div className={styles.container}>{children}</div>
}

export default PageHeader
