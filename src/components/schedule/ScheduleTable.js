import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import ApiService from '../ApiService';
import ScheduleItemRow from './ScheduleItemRow';
import ScheduleGroupRow from './ScheduleGroupRow';
import './ScheduleTable.css';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

function ScheduleTable() {
    const [data, setData] = useState([]);
    const [day, setDay] = useState(null);
    const [workers, setWorkers] = useState('');
    const [shift, setShift] = useState('');
    const [hours, setHours] = useState('');
    const [groups, setGroups] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editSchedule, setEditSchedule] = useState(null);
    const [isEditScheduleDialogVisible, setIsEditScheduleDialogVisible] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
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

    const resetForm = () => {
        setDay(null);
        setWorkers('');
        setShift(null);
        setHours('');
    };

    const fetchGroups = async () => {
        try {
            const schedules = (await ApiService.findAllSchedules()).data?.data || [];

            const grouped = Object.values(
                schedules.reduce((acc, item) => {
                    const fromISO = item.dateFrom;
                    const toISO = item.dateTo;
                    const key = `${fromISO}_${toISO}`;
                    if (!acc[key]) acc[key] = { dateFrom: fromISO, dateTo: toISO, shifts: [] };

                    acc[key].shifts.push(item);
                    return acc;
                }, {})
            );

            setGroups(grouped);
        } catch (error) {
            console.error(error);
            toast.current.show({ severity: 'error', summary: 'Σφάλμα', detail: 'Αποτυχία φόρτωσης προγράμματος' });
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleEditSchedule = async () => {
        let newErrors = [];

        if (!editSchedule?.day) newErrors.push("Ημέρα");
        if (!editSchedule?.workers) newErrors.push("Εργαζόμενοι");
        if (!editSchedule?.shift) newErrors.push("Βάρδια");
        if (!editSchedule?.hours) newErrors.push("Ώρες"); 
        
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

        try {
            const response = await ApiService.updateSchedule(editSchedule);
            setIsEditScheduleDialogVisible(false);
            fetchGroups();
            if (response.status === 200) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Επιτυχία',
                    detail: 'Η παραγγελία ενημερώθηκε.',
                    life: 3000
                });

                const newSchedule = { day, workers, shift, hours };
                    setData([...data, newSchedule]);
                    resetForm();
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

    const handleDeleteItem = async (itemId) => {
        try {
            await ApiService.deleteSchedule(itemId);
            const newGroups = groups
                .map(group => ({ ...group, shifts: group.shifts.filter(i => i.id !== itemId) }))
                .filter(group => group.shifts.length > 0);

            setGroups(newGroups);
            toast.current.show({ severity: 'success', summary: 'Επιτυχία', detail: 'Η βάρδια διαγράφηκε.', life: 3000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Σφάλμα', detail: 'Αποτυχία διαγραφής.', life: 3000 });
        }
    };

    const handleDeleteGroup = async (group) => {
        try {
            await Promise.all(group.shifts.map(i => ApiService.deleteSchedule(i.id)));
            setGroups(groups.filter(g => g !== group));
            toast.current.show({ severity: 'success', summary: 'Επιτυχία', detail: 'Το group διαγράφηκε.', life: 3000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Σφάλμα', detail: 'Αποτυχία διαγραφής group.', life: 3000 });
        }
    };

    const filteredGroups = groups.filter(group => {
        const fromStr = group.dateFrom ? String(group.dateFrom) : '';
        const toStr = group.dateTo ? String(group.dateTo) : '';
        
        const groupMatches = fromStr.includes(searchTerm) || toStr.includes(searchTerm);

        const itemsMatch = group.shifts?.some(i =>
            i.workers?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.shift?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || false;

        return groupMatches || itemsMatch;
    });

    const rowExpansionTemplate = (group) => {
        const filteredItems = group.shifts.filter(i =>
            i.workers?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.shift?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="p-3">
                <DataTable
                    value={filteredItems}
                    responsiveLayout="scroll"
                    tableStyle={{ minWidth: '30rem' }}
                    selection={selectedItems}
                    onSelectionChange={(e) => setSelectedItems(e.value)}
                    dataKey="id"
                    rowClassName={(rowData) => selectedItems.includes(rowData) ? 'selected-row' : ''} 
                >   
                    <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
                    <Column field="day" header="Ημέρα" style={{ width: '30%'}} />
                    <Column field="workers" header="Εργαζόμενος" style={{ width: '30%' }} />
                    <Column field="shift" header="Βάρδια" style={{ width: '30%' }} />
                    <Column field="hours" header="Ώρες" style={{ width: '20%' }} />
                    <Column
                        body={(schedule) => <ScheduleItemRow 
                            item={schedule}
                            onEdit={(item) => {
                                setEditSchedule({
                                    ...item
                                });
                                setIsEditScheduleDialogVisible(true);
                            }}
                            onDelete={handleDeleteItem} 
                            />}
                        header="Διαγραφή Group"
                        style={{ width: '10%' }}
                    />
                </DataTable>
            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />

            <Dialog
                header="Ενημέρωση Παραγγελίας"
                visible={isEditScheduleDialogVisible}
                style={{ width: '400px' }}
                onHide={() => setIsEditScheduleDialogVisible(false)}
                className="add-item-dialog"
            >
                <label className="center-label">Ημέρα</label>
                <div className="input-field-wrapper">
                    <Dropdown
                        placeholder="Ημέρα"
                        value={editSchedule?.day || null}
                        options={days}
                        onChange={(e) =>
                            setEditSchedule({
                                ...editSchedule,
                                day: e.value
                            })
                        }
                        className="input-text-schedule"
                    />
                </div>
                <label className="center-label">Εργαζόμενος</label>
                <div className="input-field-wrapper">
                    <InputText
                        value={editSchedule?.workers || ''}
                        onChange={(e) => setEditSchedule({ ...editSchedule, workers: e.target.value })}
                        placeholder="Εργαζόμενος"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>
                <label className="center-label">Βάρδια</label>
                <div className="input-field-wrapper">
                    <Dropdown
                        placeholder="Ημέρα"
                        value={editSchedule?.shift || null}
                        options={shifts}
                        onChange={(e) =>
                            setEditSchedule({
                                ...editSchedule,
                                shift: e.value
                            })
                        }
                        className="input-text-schedule"
                    />
                </div>
                <label className="center-label">Ώρες</label>
                <div className="input-field-wrapper">
                    <InputText
                        value={editSchedule?.hours || ''}
                        onChange={(e) => setEditSchedule({ ...editSchedule, hours: e.target.value })}
                        placeholder="Ώρες"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>
                <Button
                    label="Αποθήκευση"
                    onClick={handleEditSchedule}
                    className="save-button-pricelist"
                />
            </Dialog>

            <div style={{ marginTop: '20px', padding: '20px', margin: 'auto' }}>
                <InputText
                    placeholder="Αναζήτηση..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-text-search"
                />

                <DataTable
                    value={filteredGroups}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                    dataKey={(row) => `${row.dateFrom}_${row.dateTo}`}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25]}
                    tableStyle={{ minWidth: '50rem' }}
                >
                    <Column expander style={{ width: '3rem' }} />
                    <Column 
                        header="Ημερομηνία Από" 
                        style={{ width: '25%' }} 
                        body={(group) => {
                            const date = new Date(group.dateFrom);
                            return date.toLocaleDateString('en-GB');
                        }} 
                    />
                    <Column 
                        header="Ημερομηνία Έως" 
                        style={{ width: '25%' }} 
                        body={(group) => {
                            const date = new Date(group.dateTo);
                            return date.toLocaleDateString('en-GB');
                        }} 
                    />
                    <Column 
                        field="shifts.length" 
                        header="Αριθμός Βαρδιών" 
                        style={{ width: '25%' }} />
                    <Column
                        body={(group) => <ScheduleGroupRow group={group} onDelete={handleDeleteGroup} />}
                        header="Διαγραφή Group"
                        style={{ width: '10%' }}
                    />
                </DataTable>
            </div>
        </div>
    );
}

export default ScheduleTable;