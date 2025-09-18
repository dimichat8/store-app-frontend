import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import axios from "axios";
import './Notes.css'; 
import { Calendar } from 'primereact/calendar';
import { InputText } from "primereact/inputtext";

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('')
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);

    const fetchNotes = async () => {
        try {
            const response = await axios.get("http://localhost:8080/note/find/byFilters", {
                params: {
                    title: title.trim() || null,
                    dateFrom: dateFrom ? formatDateToISO(dateFrom) : null,
                    dateTo: dateTo ? formatDateToISO(dateTo) : null
                }
                });
            console.log(response.data);
            setNotes(response.data.data);
        } catch (error) {
            console.error("Σφάλμα:", error);
        }
    };

    function formatDateToISO(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

    useEffect(() => {
        fetchNotes();
    }, [title, dateFrom, dateTo]);

    return (
        <div>
            <div className="calendar-title">
                <InputText value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Αναζήτηση τίτλου" 
                />
            </div>
        
            <div className="calendar-wrapper">
                <Calendar 
                    value={dateFrom} 
                    onChange={(e) => setDateFrom(e.value)} 
                    selectionMode="single" 
                    placeholder="Από"
                    dateFormat="dd/mm/yy"
                />
                <Calendar 
                    value={dateTo} 
                    onChange={(e) => setDateTo(e.value)} 
                    selectionMode="single" 
                    placeholder="Έως" 
                    dateFormat="dd/mm/yy"
                />
            </div>      

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '1rem' }}>
                {notes.map((note, index) => (
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