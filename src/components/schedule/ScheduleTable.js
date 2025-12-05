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

function ScheduleTable() {
    const [groups, setGroups] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const toast = useRef(null);

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
                        body={(item) => <ScheduleItemRow item={item} onDelete={handleDeleteItem} />}
                        header="Διαγραφή"
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