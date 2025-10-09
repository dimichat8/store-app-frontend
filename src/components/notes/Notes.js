import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import './Notes.css'; 
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import ApiService from '../ApiService';


const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);

    const fetchAllNotes = async () => {
        try {
            const response = await ApiService.findAllNotes();
            setNotes(response.data.data || []);
        } catch (error) {
            console.error("Σφάλμα:", error);
        }
    };

    useEffect(() => {
        fetchAllNotes();
    }, []);

    const filteredNotes = notes.filter((note) => {
        const matchesTitle =
            !title || (note.title && note.title.toLowerCase().includes(title.toLowerCase()));

        const noteDate = new Date(note.createdAt);
        
        const fromDate = dateFrom ? new Date(dateFrom.setHours(0,0,0,0)) : null;
        const toDate = dateTo ? new Date(dateTo.setHours(23,59,59,999)) : null;

        const matchesDateFrom = !fromDate || noteDate >= fromDate;
        const matchesDateTo = !toDate || noteDate <= toDate;

        return matchesTitle && matchesDateFrom && matchesDateTo;
    });

    return (
        <div>
            <div>
                <InputText
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Αναζήτηση τίτλου" 
                    className="calendar-title"
                />
            </div>
        
            <div className="calendar-wrapper">
                <Calendar 
                    value={dateFrom} 
                    onChange={(e) => setDateFrom(e.value)} 
                    selectionMode="single" 
                    placeholder="Από"
                    dateFormat="dd/mm/yy"
                    showIcon
                    className="custom-calendar"
                />
                <Calendar 
                    value={dateTo} 
                    onChange={(e) => setDateTo(e.value)} 
                    selectionMode="single" 
                    placeholder="Έως" 
                    dateFormat="dd/mm/yy"
                    showIcon
                    className="custom-calendar"
                />
            </div>      

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '1rem' }}>
                {filteredNotes.map((note, index) => (
                    <Card
                        key={index}
                        title={`${note.title} | ${note.createdAt}`}
                        style={{
                            width: '25rem',
                            border: '1px solid rgba(204, 173, 87, 0.788)',
                            borderRadius: '8px'
                        }}
                    >
                        <p className="m-0" style={{ lineHeight: '1.5' }}>{note.content}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Notes;