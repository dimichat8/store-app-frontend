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
import { Calendar } from 'primereact/calendar';
import ApiService from '../../ApiService';

const AddSchedule = () => {
    const [data, setData] = useState([]);
    const [day, setDay] = useState(null);
    const [workers, setWorkers] = useState('');
    const [shift, setShift] = useState('');
    const [hours, setHours] = useState('');
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
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

    const formatDate = (date) => {
        if (!date) return '';
        const pad = (n) => n < 10 ? '0' + n : n;
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };

    const addSchedule = () => {
        let newErrors = [];

        if (!day) newErrors.push("Ημέρα");
        if (!shift) newErrors.push("Βάρδια");
        if (!workers) newErrors.push("Εργαζόμενοι");
        if (!hours) newErrors.push("Ώρες");
        if (!dateFrom) newErrors.push("Από");
        if (!dateTo) newErrors.push("Έως");

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
    
        const timeRegex = /^\s*\d{1,2}(:\d{1,2})?\s*-\s*\d{1,2}(:\d{1,2})?\s*$/;

        if (!timeRegex.test(hours)) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Σφάλμα', 
                detail: 'Παραδείγμα Ώρας (7:00 - 14:00) Πρόσεχε τα κενά', 
                life: 3000 
            });
            return;
        }

        const newSchedule = { day, workers, shift, hours, dateFrom, dateTo };
        setData([...data, newSchedule]);
        resetForm();
    };

    const saveAllSchedules = async () => {
        if (data.length === 0) {
            toast.current.show({
                severity: 'warn',
                summary: 'Προσοχή',
                detail: 'Δεν υπάρχει τίποτα για αποθήκευση!',
                life: 3000
            });
            return;
        }
        const pad = (n) => n < 10 ? '0' + n : n;

        const payload = data.map(d => ({
            day: d.day,
            workers: d.workers,
            shift: d.shift,
            hours: d.hours,
            dateFrom: formatDate(d.dateFrom),
            dateTo: formatDate(d.dateTo)
        }));
        try {
            const response = await ApiService.addSchedules(payload);
            toast.current.show({
                severity: 'success',
                summary: 'Επιτυχία',
                detail: response.data.message,
                life: 3000
            });
            setData([]);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Σφάλμα',
                detail: 'Κάτι πήγε στραβά κατά την αποθήκευση!',
                life: 3000
            });
        }
    };

    const resetForm = () => {
        setDay(null);
        setWorkers('');
        setShift(null);
        setHours('');
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

    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            addSchedule();
        }
    };

    return (
        <div>
            <h2>Δημιουργία Προγράμματος Εργαζομένων</h2>
            <Toast ref={toast} />
            
             <div className="input-row">
                <Calendar placeholder="Από"
                          value={dateFrom} 
                          onChange={(e) => setDateFrom(e.value)} 
                          dateFormat="yy-mm-dd" 
                          showIcon 
                          onKeyDown={handleEnterKey}
                />
                <Calendar placeholder="Έως" 
                          value={dateTo} 
                          onChange={(e) => setDateTo(e.value)} 
                          dateFormat="yy-mm-dd" 
                          showIcon 
                          onKeyDown={handleEnterKey}
                />
            </div>

            <div>
                <div className="input-row">
                    <Dropdown 
                        placeholder="Ημέρα" 
                        value={day} 
                        options={days}
                        onChange={(e) => setDay(e.value)} 
                        className='input-text-schedule'
                        onKeyDown={handleEnterKey}
                    />
                    <Dropdown 
                        placeholder="Βάρδια" 
                        value={shift} 
                        options={shifts} 
                        onChange={(e) => setShift(e.target.value)} 
                        className='input-text-schedule'  
                        onKeyDown={handleEnterKey}              
                    />
                </div>
            </div>
            <div className="input-row">
                <InputText 
                    placeholder="Εργαζόμενοι (Χρήστος/Σταυρούλα)" 
                    value={workers} 
                    onChange={(e) => setWorkers(e.target.value)} 
                    className='input-text-schedule'  
                    onKeyDown={handleEnterKey}             
                />
                <InputText 
                    placeholder="Ώρες (7:00 - 14:00)" 
                    value={hours} 
                    onChange={(e) => setHours(e.target.value)}
                    className='input-text-schedule'   
                    onKeyDown={handleEnterKey}             
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
                    onClick={saveAllSchedules } 
                    rounded 
                    style={{ marginLeft: '10px' }} 
                />
            </div>
            
            <DataTable value={data} style={{ marginTop: '20px' }}>
                <Column field="dateFrom" header="Από" body={(row) => formatDate(row.dateFrom)} />
                <Column field="dateTo" header="Εως" body={(row) => formatDate(row.dateTo)}/>
                <Column field="day" header="Ημέρα" />
                <Column field="workers" header="Εργαζόμενος" />
                <Column field="shift" header="Βάρδια" />
                <Column field="hours" header="Ώρες" />
                <Column 
                    body={actionBodyTemplate} 
                    header="Διαγραφή" 
                    style={{ textAlign: 'center', width: '120px' }} 
                />
            </DataTable>
        </div>
    );
};

export default AddSchedule;