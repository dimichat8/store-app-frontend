import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext'; 
import { Button } from 'primereact/button'; 
import { Toast } from 'primereact/toast'; 
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css'; 
import '../login/LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const toast = React.useRef(null); 

    const [errors, setErrors] = useState({username: '', password: ''})

    const handleLogin = (e) => {
        e.preventDefault();

        let newErrors = {username: '', password: ''};
        let isvalid = true;

        if (!username) {
            newErrors.username = 'Παρακαλώ εισάγετε όνομα χρήση';
            isvalid = false;
        }
         
        if (!password) {
            newErrors.password = 'Παρακαλώ εισάγετε κωδικό χρήστη'
            isvalid = false;
        }

        setErrors(newErrors);
        
        if ((username && password) && isvalid) {
        
            toast.current.show({ severity: 'success', summary: 'Επιτυχής είσοδος!', detail: 'Καλώς ήρθατε!', life: 3000 });
        } else {
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
                        placeholder="Πληκτρολογήστε το όνομα" 
                        className='input-text-username'
                    />
                    {errors.username && <div style={{ textAlign: 'center', color: 'red', fontSize: '0.9em' }}>{errors.username}</div>}                
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
                        placeholder="Πληκτρολογήστε τον κωδικό" 
                        className='input-text-password'
                    />
                    {errors.password && <div style={{textAlign: 'center', color: 'red', fontSize: '0.9em' }}>{errors.password}</div>}  
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