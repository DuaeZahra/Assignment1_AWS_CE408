import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import EventList from './components/EventList'
import LoginModal from './components/LoginModal'

function App() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      try {
        const eventsData = await import('./api/events').then(m => m.fetchEvents())
        setEvents(eventsData)
      } catch (err) {
        console.error('Failed to load events:', err)
        setError('Failed to load events. Using demo data.')
        const { fetchEvents } = await import('./api/events')
        setEvents(await fetchEvents())
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [])

  const handleRegisterClick = (event) => {
    if (!user) {
      setShowLogin(true)
    } else {
      setSelectedEvent(event)
      setShowRegister(true)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar
        user={user}
        onLoginClick={() => setShowLogin(true)}
        onLogout={() => setUser(null)}
      />
      <Hero />
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-4 py-3 text-sm text-center">
            {error}
          </div>
        )}
        <EventList
          events={events}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          showRegister={showRegister}
          setShowRegister={setShowRegister}
          onRegisterClick={handleRegisterClick}
          user={user}
        />
      </main>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={(userData) => setUser(userData)}
        />
      )}
    </div>
  )
}

export default App
