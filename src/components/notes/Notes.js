import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import './Notes.css'; 
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import ApiService from '../ApiService';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Sidebar } from 'primereact/sidebar';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [visible, setVisible] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [editNote, setEditNote] = useState(null);
    const [isEditNoteDialogVisible, setIsEditNoteDialogVisible] = useState(false);
    const toast = useRef(null);
    
    const stringToLocalDate = (dateString) => {
        if (!dateString) return null;
            const [year, month, day] = dateString.split('-').map(Number);
            return new Date(year, month - 1, day);
    };

    const localDateToString = (dateObj) => {
        if (!dateObj) return null;
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
    };

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

    const handleEditNote = async () => {
        try {
            const payload = {
                ...editNote,
                createdAt: localDateToString(editNote.createdAt)
            };
            const response = await ApiService.updateNote(payload);
            console.log(response.data);
            setIsEditNoteDialogVisible(false);
            fetchAllNotes();
            if (response.status === 200) {
            toast.current.show({
                severity: 'success',
                summary: 'Επιτυχία',
                detail: 'Η παραγγελία ενημερώθηκε.',
                life: 3000
            });
        }
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Σφάλμα',
                detail: 'Αποτυχία ενημέρωσης παραγγελίας.',
                life: 3000
            });
        }
    };
       

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
            <Toast ref={toast} />
            <ConfirmDialog />
            <Dialog
                header="Επεξεργασία Σημείωσης"
                visible={isEditNoteDialogVisible}
                style={{ width: '35rem' }}
                onHide={() => setIsEditNoteDialogVisible(false)}
            >
                <Calendar 
                    value={editNote?.createdAt || null}
                    onChange={(e) => setEditNote({ ...editNote, createdAt: e.value })} 
                    selectionMode="single"
                    placeholder="(dd/mm/yy)"
                    dateFormat="dd/mm/yy"
                    showIcon
                    className="custom-calendar"
                />
                <InputText 
                    value={editNote?.title}
                    onChange={(e) => {
                        if (e.target.value.length <= 25) {
                            setEditNote({ ...editNote, title: e.target.value });
                        }
                    }}
                    placeholder="Τίτλος.. (μέχρι 25 χαρακτήρες)"
                    className='input-text-calendar-notes-title'
                    style={{ width: '100%', marginTop: '10px' }}
                />

                <InputTextarea 
                    value={editNote?.content}
                    onChange={(e) => setEditNote({ ...editNote, content: e.target.value })} 
                    placeholder="Σημείωση.."
                    className='input-text-calendar-notes'
                    style={{ marginTop: '10px', width: '100%' }}
                    rows={5}
                />

                <div 
                    style={{
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem'
                    }}
                >
                    <Button 
                        label="Αποθήκευση"
                        onClick={handleEditNote}
                        className="save-button-pricelist"
                    />
                </div>
            </Dialog>

            <Sidebar visible={visible} position="right" onHide={() => setVisible(false)}>
                {selectedNote ? (
                    <div>
                        <h2>{selectedNote.title}</h2>
                         <b>Ημερομηνία:</b> {new Date(selectedNote.createdAt).toLocaleDateString('en-GB')}
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
                            title={`${note.title} | ${new Date(note.createdAt).toLocaleDateString('en-GB')}`}
                            style={{
                                width: '25rem',
                                border: '1px solid rgba(204, 173, 87, 0.788)',
                                borderRadius: '8px',
                                position: 'relative', 
                                paddingBottom: '3rem'
                            }}
                        >
                            <p className="card-content" style={{ lineHeight: '1' }}>{note.content}</p>

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
                                    icon="pi pi-pencil"
                                    severity="secondary"
                                    tooltip="Επεξεργασία"
                                    rounded
                                    onClick={() => {
                                        setEditNote({ ...note, createdAt: stringToLocalDate(note.createdAt) });         
                                        setIsEditNoteDialogVisible(true);
                                    }}
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