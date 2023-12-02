import React from 'react'
import App from './App/App'
import { initializeIcons } from '@fluentui/font-icons-mdl2'
import { createRoot } from 'react-dom/client'
import { initializeApp } from 'firebase/app'
import FirebaseContext from './core/contexts/FirebaseContext'

import 'rsuite/dist/rsuite.min.css'
import './indexStaticStyles.css'

initializeIcons()

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
}

const app = initializeApp(firebaseConfig)

const ConfiguredApp = () => (
    <FirebaseContext.Provider value={{ app: app }}>
        <App />
    </FirebaseContext.Provider>
)

const container = document.getElementById('surveys-app') as Element
const root = createRoot(container)

root.render(<ConfiguredApp />)
