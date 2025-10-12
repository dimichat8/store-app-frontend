import React, {useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './AddSchedule.css';

const Schedule = () => {
    const [data, setData] = useState([]);
    const [day, setDay] = useState(null);
    const [worker, setWorker] = useState('');
    const [shift, setShift] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState('');
    const toast = useRef(null);

    const days = [
        { label: 'Δευτέρα', value: 'Δευτέρα' },
        { label: 'Τρίτη', value: 'Τρίτη' },
        { label: 'Τετάρτη', value: 'Τετάρτη' },
        { label: 'Πέμπτη', value: 'Πέμπτη' },
        { label: 'Παρασκευή', value: 'Παρασκευή' },
        { label: 'Σαββάτο', value: 'Σαββάτο' },
        { label: 'Κυριακή', value: 'Κυριακή' },
    ];

    const shifts = [
        { label: 'Πρωί', value: 'Πρωί' },
        { label: 'Βράδυ', value: 'Βράδυ' },
    ];

    const addSchedule = () => {
        let newErrors = [];

        if (!day) newErrors.push("Τίτλος");
        if (!shift) newErrors.push("Βάρδια");
        if (!worker) newErrors.push("Εργαζόμενοι");
        if (!time) newErrors.push("Ώρες");

        if (newErrors.length > 0) {
            toast.current.show({
                severity: 'warn',
                content: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#f1c40f', fontSize: '1.5rem' }}>⚠️</span> 
                    <div>
                        <strong>Προσοχή</strong>
                        <div>Συμπληρώστε τα υποχρεωτικά πεδία: <b>{newErrors.join(", ")}</b></div>
                    </div>
                </div>
                ),
                life: 3000
            });
            return;
        }
    
        const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d(\s*-\s*([01]?\d|2[0-3]):[0-5]\d)?$/;

        if (!timeRegex.test(time)) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Σφάλμα', 
                detail: 'Παραδείγμα Ώρας (7:00 - 14:00) Πρόσεχε τα κενά', 
                life: 3000 
            });
            return;
        }

        const newSchedule = { day, worker, shift, time };
        setData([...data, newSchedule]);
        resetForm();
    };

    const resetForm = () => {
        setDay(null);
        setWorker('');
        setShift(null);
        setTime('');
    };

    const handleDeleteNote = (rowData) => {
        setData(prev => prev.filter(n => n !== rowData));
    };

    const actionBodyTemplate = (rowData) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button 
                icon="pi pi-pencil" 
                severity="secondary" 
                rounded 
            />
            <Button 
                icon="pi pi-trash" 
                severity="danger" 
                rounded onClick={() => handleDeleteNote(rowData)} 
            />
        </div>
    );

    return (
        <div>
            <h2>Δημιουργία Προγράμματος Εργαζομένων</h2>
            <Toast ref={toast} />
            
            <div>
                <div className="input-row">
                <Dropdown 
                    placeholder="Ημέρα" 
                    value={day} 
                    options={days}
                    onChange={(e) => setDay(e.value)} 
                    className='input-text-schedule'
                />
                <Dropdown 
                    placeholder="Βάρδια" 
                    value={shift} 
                    options={shifts} 
                    onChange={(e) => setShift(e.target.value)} 
                    className='input-text-schedule'                
                />
                </div>
            </div>
            <div className="input-row">
                <InputText 
                    placeholder="Εργαζόμενοι (Χρήστος/Σταυρούλα)" 
                    value={worker} 
                    onChange={(e) => setWorker(e.target.value)} 
                    className='input-text-schedule'               
                />
                <InputText 
                    placeholder="Ώρες (7:00 - 14:00)" 
                    value={time} 
                    onChange={(e) => setTime(e.target.value)}
                    className='input-text-schedule'                
                />
            </div>
            <div className="button-row" style={{ marginTop: '10px' }}>
                <Button 
                    className="custom-black-button" 
                    label="Προσθήκη" 
                    icon="pi pi-plus" 
                    onClick={addSchedule} 
                    rounded 
                />
                <Button 
                    className="custom-black-button" 
                    label="Αποθήκευση" 
                    icon="pi pi-save" 
                    
                    rounded 
                    style={{ marginLeft: '10px' }} 
                />
            </div>
            
            <DataTable value={data} style={{ marginTop: '20px' }}>
                <Column field="day" header="Ημέρα" />
                <Column field="worker" header="Εργαζόμενος" />
                <Column field="shift" header="Βάρδια" />
                <Column field="time" header="Ώρες" />
                <Column 
                    body={actionBodyTemplate} 
                    header="Διαγραφή" 
                    style={{ textAlign: 'center', width: '120px' }} 
                />
            </DataTable>
        </div>
    );
};

export default Schedule;