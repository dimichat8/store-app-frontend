import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button'; 
import './CalendarNotes.css';


const CalendarNotes = () => {
    const [date, setDate] = useState(new Date());
    const [note, setNote] = useState('');
    const [notes, setNotes] = useState({}); 

    const handleAddNote = () => {
        if (!note) return; 

        const formattedDate = date.toLocaleDateString(); 

        setNotes((prevNotes) => {
            const existingNotes = prevNotes[formattedDate] || [];
            return {
                ...prevNotes,
                [formattedDate]: [...existingNotes, note],
            };
        });

        setNote(''); 
    };

    return (
        <div className="calendar-container">
            <Calendar onChange={setDate} value={date} className='.react-calendar__navigation'/>
            <div>
                <div className='text-in-center'>
                <h3>Προσθήκη Σημείωσης: {date.toLocaleDateString()}</h3>
                </div>
                <InputTextarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Σημείωση.."
                    className='input-text-calendar-notes'
                />
            </div>
            <Button label="Προσθήκη Σημείωσης" 
                    className='custom-black-button' 
                    onClick={handleAddNote} 
                    rounded
                />
            <DataTable value={notes[date.toLocaleDateString()] || []} className='datatable-notes'>
                <Column field="note" header="Σημειώσεις" body={(rowData) => rowData} />
                <Column field="date" header="Ημερομηνία" body={(rowData) => date.toLocaleDateString()} />
            </DataTable>
        </div>
    );
};

export default CalendarNotes;