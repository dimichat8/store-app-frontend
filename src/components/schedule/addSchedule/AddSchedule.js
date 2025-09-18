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
        if (!day || !worker || !shift || !time) {
            toast.current.show({ 
                severity: 'wanring', 
                summary: 'Ενημέρωση', 
                detail: 'Παρακαλώ συμπληρώστε όλα τα πεδία.', 
                life: 3000 
            });
            return;
        }
    
      const timeRegex = /^(?:[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

        if (!timeRegex.test(time)) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Σφάλμα', 
                detail: 'Παρακαλώ βάλε σωστή ώρα (18:00)', 
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

    return (
        <div>
            <h2>Δημιουργία Προγράμματος Εργαζομένων</h2>
            <Toast ref={toast} />
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                <div>
                <Dropdown 
                    placeholder="Ημέρα" 
                    value={day} 
                    options={days}
                    onChange={(e) => setDay(e.value)} 
                    className='input-text-schedule'
                />
                <InputText 
                    placeholder="Εργαζόμενοι" 
                    value={worker} 
                    onChange={(e) => setWorker(e.target.value)} 
                    className='input-text-schedule'               
                />
                </div>
                <div>
                <Dropdown 
                    placeholder="Βάρδια" 
                    value={shift} 
                    options={shifts} 
                    onChange={(e) => setShift(e.target.value)} 
                    className='input-text-schedule'                
                />
                <InputText 
                    placeholder="Ώρες" 
                    value={time} 
                     onChange={(e) => setTime(e.target.value)}
                    className='input-text-schedule'                
                />
                </div>
                <Button label="Προσθήκη"
                    className='custom-black-button' 
                    icon="pi pi-plus" 
                    onClick={addSchedule}
                    rounded
                />
                
            </div>
            <DataTable value={data} style={{ marginTop: '20px' }}>
                <Column field="day" header="Ημέρα" />
                <Column field="worker" header="Εργαζόμενος" />
                <Column field="shift" header="Βάρδια" />
                <Column field="time" header="Ώρες" />
            </DataTable>
        </div>
    );
};

export default Schedule;