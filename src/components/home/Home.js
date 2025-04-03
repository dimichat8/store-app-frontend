import React from 'react';
import img from '../../1-scaled.webp';

const Home = ({ imageUrl }) => {
    return (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
            
                <img 
                    src={img} 
                    alt="User's Custom" 
                    style={{ width: '100%', height: '500px', borderRadius: '10px' }} 
                />
            
        </div>
    );
};

export default Home;