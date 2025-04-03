import React, { useState } from 'react';

const Settings = ({ onImageChange }) => {
    const [image, setImage] = useState(null); // State for the selected image

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the file
        if (file) {
            const imageUrl = URL.createObjectURL(file); // Create a URL for the image file
            setImage(imageUrl); // Update local state
            onImageChange(imageUrl); // Call the prop function to update the image in Home
        }
    };

    return (
        <div className="p-field">
            <label htmlFor="imageUpload">Ανέβασμα Εικόνας για την αρχική Οθόνη</label>
            <input 
                type="file" 
                id="imageUpload" 
                accept="image/*" 
                onChange={handleImageChange} 
            />
            {image && (
                <img 
                    src={image} 
                    alt="Uploaded" 
                    style={{ width: '100px', height: 'auto', marginTop: '10px', borderRadius: '5px' }} 
                />
            )}
        </div>
    );
};

export default Settings;