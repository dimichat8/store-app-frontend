import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button'; 
import './AddNotes.css';
import ApiService from '../ApiService';
import { Toast } from 'primereact/toast'; 

const AddNotes = () => {
    const [createdAt, setCreatedAt] = useState(new Date());
    const [title, setTitle] = useState('');
    const [content, setNote] = useState('');
    const [notesList, setNotesList] = useState([]);
    const toast = React.useRef(null); 

    const handleAddNote = () => {
    let newErrors = [];

    if (!title) newErrors.push("Τίτλος");
    if (!content) newErrors.push("Σημείωση");

    if (newErrors.length > 0) {
        toast.current.show({
            severity: 'warn',
            content: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#f1c40f', fontSize: '1.5rem' }}>⚠️</span> 
                <div>
                    <strong>Προσοχή!</strong>
                    <div>Συμπληρώστε τα υποχρεωτικά πεδία: <b>{newErrors.join(", ")}</b></div>
                </div>
            </div>
            ),
            life: 3000
        });
        return;
    }

        setNotesList(prev => [...prev, { title, content, createdAt }]);
        setTitle('');
        setNote('');
    };

    const handleDeleteNote = (rowData) => {
        setNotesList(prev => prev.filter(n => n !== rowData));
    };

    const handleSaveAll = async () => {
        if (notesList.length === 0) return;

        const pad = (n) => n < 10 ? '0' + n : n;
        const payload = notesList.map(n => ({
            title: n.title,
            content: n.content,
            createdAt: `${n.createdAt.getFullYear()}-${pad(n.createdAt.getMonth()+1)}-${pad(n.createdAt.getDate())}`
        }));

        try {
            const response = await ApiService.addNotes(payload);
            if (response.status === 200) {
                toast.current.show({
                    severity: "success",
                    summary: "Επιτυχία",
                    detail: response.data.message,
                    life: 3000,
                });
                setNotesList([]);
            } else {
                toast.current.show({
                    severity: "warn",
                    summary: "Προειδοποίηση",
                    detail: response.data.message || "Κάτι πήγε στραβά",
                    life: 3000,
                });
            }
        } catch (error) {
            console.error("Σφάλμα κατά την αποθήκευση:", error);
            toast.current.show({
                severity: "error",
                summary: "Σφάλμα",
                detail: "Αποτυχία αποθήκευσης σημειώσεων.",
                life: 3000,
            });
        }
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
        <div className="calendar-container">
            <Toast ref={toast} />

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
                    label="Προσθήκη" 
                    icon="pi pi-plus"
                    className='custom-black-button' 
                    onClick={handleAddNote} 
                    rounded
                />
                <Button 
                    label="Αποθήκευση" 
                    icon="pi pi-save"
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
                    body={(row) => row.createdAt.toLocaleDateString()} 
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