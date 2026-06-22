import React, { useState, useEffect } from 'react';
import './HeroSlider.css';

const slides = [
  {
    image: '/slider1.png',
    title: 'Nurturing Global Minds',
    description: 'Our state-of-the-art library offers a quiet and rich environment for students to read, research, and expand their boundaries.'
  },
  {
    image: '/slider2.png',
    title: 'Interactive Learning Classrooms',
    description: 'We leverage modern smartboards and collaborative seating to make English and sciences engaging and practical.'
  },
  {
    image: '/slider3.png',
    title: 'Hands-on Scientific Inquiry',
    description: 'Equipped science laboratories where children safely experiment, analyze, and learn by doing.'
  },
  {
    image: '/slider4.png',
    title: 'Championship Athletic Programs',
    description: 'Promoting teamwork, physical fitness, and leadership through structured sporting activities and inter-school trophies.'
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((current + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((current - 1 + slides.length) % slides.length);
  };

  return (
    <div className="slider-container">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`slide-item ${idx === current ? 'active' : ''}`}
        >
          <img src={slide.image} alt={slide.title} className="slide-image" />
          <div className="slide-overlay">
            <h3 className="slide-title">{slide.title}</h3>
            <p className="slide-desc">{slide.description}</p>
          </div>
        </div>
      ))}
      
      <button className="slider-btn prev" onClick={prevSlide} aria-label="Previous slide">&#10094;</button>
      <button className="slider-btn next" onClick={nextSlide} aria-label="Next slide">&#10095;</button>
      
      <div className="slider-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`slider-dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
