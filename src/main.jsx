import React from 'react'
import { createRoot } from 'react-dom/client'
import AOS from 'aos'
import 'aos/dist/aos.css'
import App from './App.jsx'
import './styles.css'

AOS.init({
  duration: 700,
  once: true,
  disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
})

createRoot(document.getElementById('root')).render(<App />)
