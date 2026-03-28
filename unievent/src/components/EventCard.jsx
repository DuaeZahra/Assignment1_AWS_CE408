const EventCard = ({ event, onRegister }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2">
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={event.image || '/placeholder-event.jpg'} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x200/1a2a6c/ffffff?text=Event+Poster'
          }}
        />
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold font-poppins text-gray-900 mb-3 line-clamp-2 group-hover:text-navy transition-colors">
          {event.title}
        </h3>
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-navy">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{formatDate(event.date)} at {formatTime(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{event.venue}</span>
          </div>
        </div>
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {event.description}
        </p>
        <div className="flex gap-3">
          <button 
            onClick={() => onRegister(event)}
            className="flex-1 bg-navy text-white py-3 px-6 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Register Now
          </button>
          <button className="p-3 text-gray-400 hover:text-navy transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventCard
