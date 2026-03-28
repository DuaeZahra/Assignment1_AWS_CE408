import { useState } from 'react'

const RegistrationModal = ({ onClose, selectedEvent }) => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true)
      setSubmitting(false)
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-3xl max-w-md w-full p-12 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
            <svg className="w-12 h-12 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold font-poppins text-navy mb-4">Registration Successful!</h2>
          <p className="text-lg text-gray-700 mb-8">
            Thank you, <span className="font-semibold">{formData.name}</span>! 
            Your registration for <span className="font-semibold">{selectedEvent?.title}</span> has been confirmed.
          </p>
          <button 
            onClick={onClose}
            className="w-full bg-navy text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-poppins text-navy mb-2">Register for Event</h2>
          <p className="text-gray-600 font-medium">{selectedEvent?.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-navy focus:outline-none transition-all"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
            <input
              type="text"
              required
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-navy focus:outline-none transition-all"
              placeholder="e.g., GIKI2023001"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-navy focus:outline-none transition-all"
              placeholder="student@giki.edu.pk"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="flex-1 bg-navy text-white py-3 px-6 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
            >
              {submitting ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegistrationModal
