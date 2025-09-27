import React, { useState } from 'react'
import Header from './components/Header'
import HomePage from './components/HomePage'
import ContactPage from './components/ContactPage'
import FAQPage from './components/FAQPage'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [currentPage, setCurrentPage] = useState('home')

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage apiKey={apiKey} />
      case 'contact':
        return <ContactPage />
      case 'faq':
        return <FAQPage />
      default:
        return <HomePage apiKey={apiKey} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      {renderCurrentPage()}
    </div>
  )
}

export default App
