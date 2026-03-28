import { useState } from 'react'

const Navbar = ({ user, onLoginClick, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-navy shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-white text-2xl font-bold font-poppins">
            UniEvent
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white hover:text-gold font-medium transition-colors">Home</a>
            <a href="#events" className="text-white hover:text-gold font-medium transition-colors">Events</a>
            <a href="#" className="text-white hover:text-gold font-medium transition-colors">Register</a>
            <a href="#" className="text-white hover:text-gold font-medium transition-colors">About</a>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <div className="w-7 h-7 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-white text-sm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-white/70 hover:text-gold text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-gold text-navy px-5 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-all shadow-md"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1">
            <a href="#" className="block text-white py-2 hover:text-gold font-medium">Home</a>
            <a href="#events" className="block text-white py-2 hover:text-gold font-medium">Events</a>
            <a href="#" className="block text-white py-2 hover:text-gold font-medium">Register</a>
            <a href="#" className="block text-white py-2 hover:text-gold font-medium">About</a>
            <div className="pt-2 border-t border-white/20">
              {user ? (
                <div className="flex items-center justify-between py-2">
                  <span className="text-white font-medium">{user.name}</span>
                  <button onClick={onLogout} className="text-gold text-sm font-semibold">Logout</button>
                </div>
              ) : (
                <button
                  onClick={() => { onLoginClick(); setIsOpen(false) }}
                  className="w-full bg-gold text-navy py-2 px-4 rounded-full font-semibold mt-1"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
