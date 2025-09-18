import React, { useState, useEffect } from 'react';
import img1 from '../../photos/nyxtas.webp'; 
import img2 from '../../photos/nyxtas2.webp'; 
import img3 from '../../photos/nyxtas3.webp'; 

const Home = () => {
  const images = [img1, img2, img3]; 
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
  <img 
    src={images[currentIndex]} 
    alt="Carousel" 
    style={{ 
      width: '100%',           
      height: '90%',          
      objectFit: 'cover',      
    }} 
  />
</div>
  );
};

export default Home;