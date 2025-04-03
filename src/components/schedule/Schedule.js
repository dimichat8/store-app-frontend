import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const Schedule = () => {
    const data = [
        { day: 'Δευτέρα', worker: 'Γιάννης/Ελένη', shift: 'Πρωί', time: '09:00 - 13:00' },
        { day: 'Δευτέρα', worker: 'Θωμαή', shift: 'Πρωί', time: '09:00 - 11:00' },
        { day: 'Δευτέρα', worker: 'Μάγδα/Αλέξανδρος', shift: 'Βράδυ', time: '17:00 - 21:00' },
        
        { day: 'Τρίτη', worker: 'Βασίλης/Αννα', shift: 'Πρωί', time: '09:00 - 13:00' },
        { day: 'Τρίτη', worker: 'Δημήτρης', shift: 'Βράδυ', time: '17:00 - 20:00' },
    
        { day: 'Τετάρτη', worker: 'Σπύρος/Κατερίνα', shift: 'Πρωί', time: '09:00 - 13:00' },
        { day: 'Τετάρτη', worker: 'Θωμαής', shift: 'Βράδυ', time: '17:00 - 21:00' },
        
        { day: 'Πέμπτη', worker: 'Γιώργος', shift: 'Πρωί', time: '09:00 - 13:00' },
        { day: 'Πέμπτη', worker: 'Αλεξάνδρα/Βασίλης', shift: 'Βράδυ', time: '17:00 - 20:00' },
    
        { day: 'Παρασκευή', worker: 'Παύλος/Κατερίνα', shift: 'Πρωί', time: '09:00 - 13:00' },
        { day: 'Παρασκευή', worker: 'Ιωάννα', shift: 'Βράδυ', time: '17:00 - 21:00' },
    
        { day: 'Σάββατο', worker: 'Δημήτρης', shift: 'Πρωί', time: '10:00 - 14:00' },
        { day: 'Σάββατο', worker: 'Μαρία/Ανδρέας', shift: 'Βράδυ', time: '18:00 - 22:00' },
    
        { day: 'Κυριακή', worker: 'Σπύρος/Κατερίνα', shift: 'Πρωί', time: '10:00 - 14:00' },
        { day: 'Κυριακή', worker: 'Γιάννης/Βασίλης', shift: 'Βράδυ', time: '18:00 - 20:00' },
    ];

    return (
        <div>
            <h2>Πρόγραμμα Εργαζομένων</h2>
            <DataTable value={data}>
                <Column field="day" header="Ημέρα" />
                <Column field="worker" header="Εργαζόμενος" />
                <Column field="shift" header="Βάρδια" />
                <Column field="time" header="Ώρες" />
            </DataTable>
        </div>
    );
};

export default Schedule;