import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const Schedule = () => {
    const [expandedRows, setExpandedRows] = useState([]);

    const data = [
        { from: '14/10/2025', to: '20/10/2025', worker: 'Γιάννης', shift: 'Πρωί', time: '09:00 - 13:00' },
        { from: '14/10/2025', to: '20/10/2025', worker: 'Ελένη', shift: 'Βράδυ', time: '17:00 - 21:00' },
        { from: '14/10/2025', to: '27/10/2025', worker: 'Μάγδα', shift: 'Πρωί', time: '09:00 - 12:00' },
        { from: '21/10/2025', to: '27/10/2025', worker: 'Αλέξανδρος', shift: 'Βράδυ', time: '17:00 - 20:00' },
        { from: '28/10/2025', to: '03/11/2025', worker: 'Βασίλης', shift: 'Πρωί', time: '10:00 - 14:00' },
        { from: '28/10/2025', to: '03/11/2025', worker: 'Άννα', shift: 'Βράδυ', time: '18:00 - 22:00' }
    ];

    
    const grouped = Object.values(
        data.reduce((acc, item) => {
            const key = `${item.from}_${item.to}`;
            if (!acc[key]) {
                acc[key] = { from: item.from, to: item.to, shifts: [] };
            }
            acc[key].shifts.push(item);
            return acc;
        }, {})
    );

    const rowExpansionTemplate = (rowData) => (
        <div className="p-3">
            <DataTable value={rowData.shifts} responsiveLayout="scroll" tableStyle={{ minWidth: '30rem' }}>
                <Column field="worker" header="Εργαζόμενος" style={{ width: '40%' }} />
                <Column field="shift" header="Βάρδια" style={{ width: '30%' }} />
                <Column field="time" header="Ώρες" style={{ width: '30%' }} />
            </DataTable>
        </div>
    );

    return (
        <div className="card p-4">
            <h2 className="mb-3">Πρόγραμμα Εργασίας</h2>

            <DataTable
                value={grouped}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey={(row) => `${row.from}_${row.to}`} // μοναδικό key για from+to
                tableStyle={{ minWidth: '50rem' }}
            >
                <Column header="Προβολή" expander style={{ width: '3rem' }} />
                <Column field="from" header="Ημερομηνία Από" style={{ width: '30%' }} />
                <Column field="to" header="Ημερομηνία Έως" style={{ width: '30%' }} />
            </DataTable>
        </div>
    );
};

export default Schedule;