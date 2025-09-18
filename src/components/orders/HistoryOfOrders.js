import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './HistoryOfOrders.css';

const data = [
  { name: 'Αλάτι', description: 'Αλάτι Ημαθίων', amount: '3', date: '10/7/2020' },
  { name: 'Ζάχαρη', description: 'Ζάχαρη Λάρισας', amount: '5', date: '12/7/2020' },
  { name: 'Αλεύρι', description: 'Αλεύρι Θεσσαλονίκης', amount: '10', date: '15/7/2020' },
  { name: 'Λάδι', description: 'Ελαιόλαδο Κέρκυρας', amount: '2', date: '20/7/2020' },
  { name: 'Ρύζι', description: 'Ρύζι Θεσσαλίας', amount: '4', date: '22/7/2020' },
  { name: 'Καφές', description: 'Καφές Ερύμανθου', amount: '6', date: '25/7/2020' },
  { name: 'Αυγά', description: 'Αυγά Κοζάνης', amount: '12', date: '28/7/2020' },
  { name: 'Τυρί', description: 'Τυρί Μακεδονίας', amount: '8', date: '30/7/2020' },
  { name: 'Ψωμί', description: 'Ψωμί Θεσσαλονίκης', amount: '15', date: '1/8/2020' },
  { name: 'Φρούτα', description: 'Φρούτα Πελοποννήσου', amount: '20', date: '5/8/2020' }
];
export default function MyTable() {
    const [rowsCount, setRowsCount] = useState(5); // Αρχική επιλογή γραμμών


    return (
        <div className="card" style={{ marginTop: '20px', padding: '20px', margin: 'auto' }}>
            <h2>Ιστορικό Παραγγελιών</h2>
            <DataTable
                value={data}
                rows={rowsCount}
                onPage={(e) => {
                setRowsCount(e.rows)
                }}
            >
                <Column field="name" header="Ονομα Προϊόντος" style={{ width: '25%' }}  className="break-word"/>
                <Column field="description" header="Περιγραφή" style={{ width: '25%' }} className="break-word"/>
                <Column field="amount" header="Ποσότητα" style={{ width: '25%' }} />
                <Column field="date" header="Ημερομηνία" style={{ width: '25%' }} />
            </DataTable>
        </div>
    );
}