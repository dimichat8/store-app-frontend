import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button'; 
import axios from 'axios';
import './AddNotes.css';

const AddNotes = () => {
    const [createdAt, setCreatedAt] = useState(new Date());
    const [title, setTitle] = useState('');
    const [content, setNote] = useState('');
    const [notesList, setNotesList] = useState([]);

    const handleAddNote = () => {
        if (!title && !content) return;

        const formattedDate = createdAt.toISOString().split('T')[0];

        setNotesList(prev => [...prev, { title, content, createdAt: formattedDate }]);
        setTitle('');
        setNote('');
    };

    const handleDeleteNote = (rowData) => {
        setNotesList(prev => prev.filter(n => n !== rowData));
    };

    const handleSaveAll = async () => {
        console.log("notesList:", notesList);
        if (notesList.length === 0) return;

        const payload = notesList.map(n => ({
            title: n.title,
            content: n.content,
            createdAt: n.createdAt,  
            }))

        try {
            const response = await axios.post("http://localhost:8080/note/add", payload,
        {
            headers: {
            "Content-Type": "application/json"
            }
        }
        ); 
            
            if (response.data.success) {
                console.log("Όλες οι σημειώσεις αποθηκεύτηκαν επιτυχώς!");
                setNotesList([]);
            } else {
                console.error("Αποτυχία αποθήκευσης:", response.data.message);
            }
        } catch (error) {
            console.error("Σφάλμα κατά την αποθήκευση:", error);
        }
    };

    const actionBodyTemplate = (rowData) => (
        <Button 
            icon="pi pi-trash" 
            className="p-button-danger custom-delete-button" 
            onClick={() => handleDeleteNote(rowData)}
            rounded
        />
    );

    return (
        <div className="calendar-container">
            <Calendar onChange={setCreatedAt} value={createdAt} />

            <div className='text-in-center' style={{ marginTop: '10px' }}>
                <h3>Προσθήκη Σημείωσης: {createdAt.toLocaleDateString()}</h3>
            </div>

            <InputText 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Τίτλος.."
                className='input-text-calendar-notes-title'
            />

            <InputTextarea 
                value={content}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Σημείωση.."
                className='input-text-calendar-notes'
                style={{ marginTop: '10px' }}
            />

            <div style={{ marginTop: '10px' }}>
                <Button 
                    label="Προσθήκη Σημείωσης" 
                    className='custom-black-button' 
                    onClick={handleAddNote} 
                    rounded
                />
                <Button 
                    label="Αποθήκευση Όλων" 
                    className='custom-black-button' 
                    onClick={handleSaveAll} 
                    rounded
                    style={{ marginLeft: '10px' }}
                />
            </div>

            <DataTable
                value={notesList}
                className="datatable-notes"
                style={{ marginTop: '20px' }}
            >
                <Column field="title" header="Τίτλος" />        
                <Column field="content" header="Σημειώσεις" />
                <Column 
                    field="createdAt" 
                    header="Ημερομηνία" 
                    body={(row) => new Date(row.createdAt).toLocaleDateString()} 
                />
                <Column 
                    body={actionBodyTemplate} 
                    header="Διαγραφή" 
                    style={{ textAlign: 'center', width: '120px' }} 
                />
            </DataTable>
        </div>
    );
};

export default AddNotes;