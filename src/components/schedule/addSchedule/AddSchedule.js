import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './AddSchedule.css';

const Schedule = () => {
    const [data, setData] = useState([]);
    const [day, setDay] = useState('');
    const [worker, setWorker] = useState('');
    const [shift, setShift] = useState('');
    const [time, setTime] = useState('');

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
        // if (!day || !worker || !shift || !time) {
        //     alert("Παρακαλώ συμπληρώστε όλα τα πεδία.");
        //     return;
        // }
    
    
    // Συνάρτηση προσθήκης προγράμματος
        const newSchedule = { day, worker, shift, time };
        setData([...data, newSchedule]);
        resetForm(); // Επαναφορά της φόρμας
    };

    const resetForm = () => {
        setDay('');
        setWorker('');
        setShift('');
        setTime('');
    };

    return (
        <div>
            <h2>Πρόγραμμα Εργαζομένων</h2>
            <div>
                <Dropdown 
                    placeholder="Ημέρα" 
                    value={day} 
                    options={days}
                    onChange={(e) => setDay(e.value)} 
                    className='input-text'
                />
                <InputText 
                    placeholder="Εργαζόμενοι" 
                    value={worker} 
                    onChange={(e) => setWorker(e.target.value)} 
                    className='input-text'               
                />
                <Dropdown 
                    placeholder="Βάρδια" 
                    value={shift} 
                    options={shifts} 
                    onChange={(e) => setShift(e.value)} 
                    className='input-text'                
                />
                <InputText 
                    placeholder="Ώρες" 
                    value={time} 
                    onChange={(e) => setTime(e.target.value)} 
                    className='input-text'                
                />
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