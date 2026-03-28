import { useState } from 'react'
import EventCard from './EventCard'
import EventDetailModal from './EventDetailModal'
import RegistrationModal from './RegistrationModal'

const EventList = ({
  events = [],
  loading,
  searchQuery,
  setSearchQuery,
  selectedEvent,
  setSelectedEvent,
  showRegister,
  setShowRegister,
  onRegisterClick
}) => {
  const categories = ['All', 'Workshops', 'Festivals', 'Sports', 'Seminars']
  const [categoryFilter, setCategoryFilter] = useState('All')

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading events...</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 mb-12 justify-between items-start md:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-gray-200 focus:border-navy focus:outline-none shadow-md transition-all"
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-navy focus:outline-none shadow-md bg-white font-medium min-w-[150px]"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-500 mb-2">No events found</h3>
          <p className="text-gray-500">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={() => {
                if (onRegisterClick) { onRegisterClick(event) }
                else { setSelectedEvent(event); setShowRegister(true) }
              }}
            />
          ))}
        </div>
      )}

      {selectedEvent && (
        <EventDetailModal 
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegister={() => {
            setSelectedEvent(null)
            setShowRegister(true)
          }}
        />
      )}

      {showRegister && (
        <RegistrationModal 
          onClose={() => setShowRegister(false)}
          selectedEvent={selectedEvent}
        />
      )}
    </>
  )
}

export default EventList
