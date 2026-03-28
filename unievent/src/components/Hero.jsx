const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-navy to-blue-900 text-white py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold font-poppins mb-6">
          Welcome to UniEvent
        </h1>
        <p className="text-2xl md:text-3xl mb-8 opacity-90">
          Your Campus, Your Events
        </p>
        <p className="text-xl mb-12 max-w-2xl mx-auto opacity-80">
          Discover, register, and never miss out on GIKI University events. From workshops to festivals, everything you need is here.
        </p>
        <a 
          href="#events" 
          className="bg-gold text-navy px-12 py-4 rounded-full text-xl font-semibold hover:bg-yellow-400 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          Explore Events
        </a>
      </div>
    </section>
  )
}

export default Hero
