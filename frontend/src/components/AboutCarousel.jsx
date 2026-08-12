import React, { useEffect, useState } from 'react'

const AboutCarousel = () => {
  const images = ['/img/hero1.jpeg', '/img/hero2.jpeg', '/img/hero3.jpeg', '/img/hero4.jpeg']
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % images.length), 5000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[50vw] w-full">
        {images.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`LJKA Banner ${index + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              current === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 w-2 rounded-full transition ${
              current === index ? 'bg-[#002b63]' : 'bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

export default AboutCarousel