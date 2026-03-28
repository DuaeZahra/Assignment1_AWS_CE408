const EventDetailModal = ({ event, onClose, onRegister }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  })

  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit', hour12: true
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-4xl font-bold font-poppins text-navy mb-4">{event.title}</h2>
              <div className="flex flex-wrap gap-6 text-lg">
                <div className="flex items-center bg-gold/10 gold px-4 py-2 rounded-xl">
                  <svg className="w-6 h-6 mr-2 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {formatDate(event.date)} at {formatTime(event.date)}
                </div>
                <div className="flex items-center text-navy">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.venue}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-3xl hover:text-navy transition-colors">&times;</button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            <div>
              <img 
                src={event.image || 'https://via.placeholder.com/600x400/1a2a6c/ffffff?text=Event+Poster'}
                alt={event.title}
                className="w-full rounded-2xl shadow-xl object-cover h-96"
                onError={(e) => e.target.src = 'https://via.placeholder.com/600x400/1a2a6c/ffffff?text=Event+Poster'}
              />
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-2xl font-bold font-poppins mb-4 text-gray-800">About This Event</h4>
                <p className="text-lg leading-relaxed text-gray-700">{event.description}</p>
              </div>
              {event.organizer && (
                <div className="bg-navy/5 p-6 rounded-xl">
                  <h5 className="font-semibold text-navy mb-2">Organizer</h5>
                  <p>{event.organizer}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
            <button 
              onClick={onRegister}
              className="flex-1 bg-navy text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl hover:shadow-2xl"
            >
              Register for Event
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-800 py-4 px-8 rounded-2xl font-semibold hover:bg-gray-200 transition-all shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailModal
