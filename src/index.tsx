import React from 'react'
import App from './App/App'
import { initializeIcons } from '@fluentui/font-icons-mdl2'
import { createRoot } from 'react-dom/client'

import 'rsuite/dist/rsuite.min.css'
import './indexStaticStyles.css'

initializeIcons()

const ConfiguredApp = () => <App />

const container = document.getElementById('surveys-app') as Element
const root = createRoot(container)

root.render(<ConfiguredApp />)
