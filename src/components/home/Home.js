import React, { useState, useEffect } from 'react';
import img1 from '../../photos/1-scaled.webp'; 
import img2 from '../../photos/2.jpeg'; 
import img3 from '../../photos/3.jpeg'; 

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
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
      <img 
        src={images[currentIndex]} 
        alt="Carousel" 
        style={{ width: '100%', height: '500px', borderRadius: '10px' }} 
      />
    </div>
  );
};

export default Home;