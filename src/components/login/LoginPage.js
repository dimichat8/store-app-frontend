import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext'; 
import { Button } from 'primereact/button'; 
import { Toast } from 'primereact/toast'; 
import '../login/LoginPage.css';
import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';
import Register from '../register/Register';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [errors, setErrors] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const toast = useRef(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        let newErrors = { username: '', password: '' };
        let isValid = true;

        if (!username) {
            newErrors.username = 'Παρακαλώ εισάγετε όνομα χρήστη';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Παρακαλώ εισάγετε κωδικό χρήστη';
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) {
            toast.current.show({ severity: 'error', summary: 'Αποτυχημένη είσοδος', detail: 'Συμπληρώστε όλα τα πεδία', life: 3000 });
            return;
        }

        const success = await login(username, password);

        if (success) {
            toast.current.show({ severity: 'success', summary: 'Επιτυχής είσοδος', detail: 'Καλώς ήρθατε!', life: 2000 });
            setTimeout(() => window.location.href="/home", 500); 
        } else {
            toast.current.show({ severity: 'error', summary: 'Αποτυχημένη είσοδος', detail: 'Λανθασμένα στοιχεία ή πρόβλημα σύνδεσης', sticky: true });
        }
    };

    return (
        <div className="card" style={{ width: '400px', margin: '50px auto', padding: '20px' }}>
            <h2 className="centered-header">Είσοδος στην εφαρμογή</h2>
            <Toast ref={toast} />
            <form onSubmit={handleLogin}>
                <div className="p-field">
                    <label className="center-label">Όνομα</label>
                    <InputText 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="Πληκτρολογήστε το όνομα" 
                        className='input-text-username-password'
                    />
                    {errors.username && <div style={{ textAlign: 'center', color: 'red', fontSize: '0.9em' }}>{errors.username}</div>}                
                </div>
                <div className="p-field" style={{ position: 'relative' }}>
                    <label className="center-label">Κωδικός</label>
                    <InputText
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Πληκτρολογήστε τον κωδικό"
                        className='input-text-username-password'
                    />
                    <Button
                        type="button" 
                        icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}
                        className="eye-button"
                        onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword); }}
                        tabIndex={-1} 
                    />
                    {errors.password && <div style={{ textAlign: 'center', color: 'red', fontSize: '0.9em' }}>{errors.password}</div>}
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#007ad9', fontWeight: 'bold' }}>
                            Ξέχασα τον κωδικό
                        </Link>
                    </div>
                </div>
                <Button 
                    type="submit" 
                    label="Είσοδος" 
                    className="sign-in-button" 
                    style={{ width: '100%' }} 
                    rounded
                />
            </form>
            <Button 
                label="Eγγραφή" 
                className="sign-up-button" 
                onClick={() => setVisible(true)}
                style={{ width: '100%' }} 
                rounded
            />
            <Register 
                visible={visible}
                setVisible={setVisible}
            />
        </div>
    );
};

export default LoginPage;