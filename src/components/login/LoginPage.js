import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext'; // Import PrimeReact InputText
import { Button } from 'primereact/button'; // Import PrimeReact Button
import { Toast } from 'primereact/toast'; // Import Toast for notifications
import 'primereact/resources/themes/saga-blue/theme.css'; // Import the theme
import 'primereact/resources/primereact.min.css'; // Import core styles
import 'primeicons/primeicons.css'; // Import PrimeIcons
import '../login/LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const toast = React.useRef(null); // Reference for toast notifications

    const handleLogin = (e) => {
        e.preventDefault();
        // Implement your login logic here
        if (username && password) {
            // Successful login handling
            toast.current.show({ severity: 'success', summary: 'Επιτυχής είσοδος!', detail: 'Καλώς ήρθατε!', life: 3000 });
        } else {
            // Handling failed login or validation
            toast.current.show({ severity: 'error', summary: 'Αποτυχημένη είσοδος.', detail: 'Παρακαλώ πληκτρολογήστε τα διαπιστευτήρια.', life: 3000 });
        }
    };

    return (
        <div className="card" style={{ width: '400px', margin: '50px auto', padding: '20px' }}>
            <h2 className="centered-header">Είσοδος στην εφαρμογή</h2>
            <Toast ref={toast} />
            <form onSubmit={handleLogin}>
                <div className="p-field">
                <label htmlFor="username" style={{ textAlign: 'center', width: '100%'}}>
                    <h4 style={{ marginBottom: '5px', textAlign: 'center' }}>Όνομα</h4>
                </label>
                    <InputText 
                        id="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        placeholder="Πληκτρολογήστε το όνομα" 
                        className='input-text-username'
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="username" style={{ textAlign: 'center', width: '100%'}}>
                        <h4 style={{ marginBottom: '5px', textAlign: 'center' }}>Κωδικός</h4>
                    </label>
                    <InputText 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        type="password" 
                        required 
                        placeholder="Πληκτρολογήστε τον κωδικό" 
                        className='input-text-password'
                    />
                </div>

                <Button 
                    type="submit" 
                    label="Είσοδος" 
                    className="custom-black-button" 
                    style={{ width: '100%' }} 
                    rounded
                />
            </form>
        </div>
    );
};

export default LoginPage;