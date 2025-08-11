import React, { useState, useEffect } from 'react'
import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'

function App(): React.JSX.Element {
  const [backendUrl, setBackendUrl] = useState<string | null>(null)
  const [companies, setCompanies] = useState<any[]>([])
  const [message, setMessage] = useState('Fetching API URL...')
  const [loading, setLoading] = useState(true)

  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  useEffect(() => {
    // Get NestJS API URL from main process
    window.api.getNestApiUrl().then((url) => {
      setBackendUrl(url)
      setMessage(`NestJS API URL: ${url}`)
    }).catch((err) => {
      setMessage(`Failed to get API URL: ${err.message}`)
      console.error(err)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (backendUrl) {
      // Test API connection by fetching companies
      const fetchCompanies = async () => {
        try {
          const response = await fetch(`${backendUrl}/company`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          setCompanies(data)
          setMessage('Backend connection successful! Companies loaded.')
          setLoading(false)
        } catch (error: any) {
          setMessage(`Error connecting to backend: ${error.message}`)
          console.error('Error fetching companies:', error)
          setLoading(false)
        }
      }

      // Wait a moment for backend to start, then test connection
      setTimeout(fetchCompanies, 2000)
    }
  }, [backendUrl])

  return (
    <>
      <div className="logo" style={{ fontSize: '48px', marginBottom: '20px' }}>⚡</div>
      <div className="creator">Atropos POS System</div>
      <div className="text">
        Built with <span className="react">React</span>, <span className="ts">TypeScript</span>, 
        <span style={{color: '#e10098'}}> NestJS</span> & <span style={{color: '#336791'}}> PostgreSQL</span>
      </div>
      
      <div style={{ margin: '20px 0', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Backend Status</h3>
        <p style={{ color: loading ? '#ff9500' : companies.length > 0 ? '#28a745' : '#dc3545' }}>
          {message}
        </p>
        {companies.length > 0 && (
          <div>
            <h4>Companies in Database:</h4>
            <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
              {companies.map((company) => (
                <li key={company.id} style={{ marginBottom: '5px' }}>
                  <strong>{company.name}</strong> (Tax: {company.taxNumber})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="tip">
        Press <code>F12</code> to open DevTools and see backend logs
      </p>
      
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
