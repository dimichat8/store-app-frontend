import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import './Notes.css'; 
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import ApiService from '../ApiService';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Sidebar } from 'primereact/sidebar';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [visible, setVisible] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

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

    const handleDeleteNote = async (noteId) => {
        try {
            await ApiService.deleteNoteById(noteId);
            setNotes(prev => prev.filter(note => note.id !== noteId));
        } catch (error) {
            console.error("Σφάλμα κατά τη διαγραφή:", error);
        }
    };

    const confirmDelete = (noteId) => {
        confirmDialog({
            message: 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή τη σημείωση;',
            header: 'Επιβεβαίωση Διαγραφής',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Ναι',
            rejectLabel: 'Όχι',
            acceptClassName: 'custom-accept-button',
            rejectClassName: 'custom-reject-button',
            accept: () => handleDeleteNote(noteId),
        });
    };

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

    const openNoteDetails = (note) => {
        setSelectedNote(note);
        setVisible(true);
    };

    return (
        <div>
            <ConfirmDialog />

            <Sidebar visible={visible} position="right" onHide={() => setVisible(false)}>
                {selectedNote ? (
                    <div>
                        <h2>{selectedNote.title}</h2>
                        <p><b>Ημερομηνία:</b> {selectedNote.createdAt}</p>
                        <hr />
                        <p style={{ whiteSpace: 'pre-line' }}>{selectedNote.content}</p>
                    </div>
                ) : (
                    <p>Δεν υπάρχει επιλεγμένη σημείωση.</p>
                )}
            </Sidebar>

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

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '1rem', justifyContent: 'center' }}>
                {filteredNotes
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((note, index) => (
                        <Card
                            key={index}
                            title={`${note.title} | ${note.createdAt}`}
                            style={{
                                width: '25rem',
                                border: '1px solid rgba(204, 173, 87, 0.788)',
                                borderRadius: '8px',
                                position: 'relative', 
                                paddingBottom: '3rem'
                            }}
                        >
                            <p className="card-content" style={{ lineHeight: '1.5' }}>{note.content}</p>

                            <div style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                display: 'flex',
                                gap: '0.5rem'
                            }}>
                                <Button 
                                    icon="pi pi-eye"
                                    className="p-button-info p-button-rounded"
                                    size="small"
                                    tooltip="Προβολή"
                                    onClick={() => openNoteDetails(note)}
                                />

                                <Button 
                                    icon="pi pi-trash"
                                    className="p-button-danger p-button-rounded"
                                    size="small"
                                    tooltip="Διαγραφή"
                                    onClick={() => confirmDelete(note.id)}
                                />
                            </div>
                        </Card>
                    ))
                }
            </div>
        </div>
    );
};

export default Notes;