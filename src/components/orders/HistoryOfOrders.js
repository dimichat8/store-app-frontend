import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './HistoryOfOrders.css';
import ApiService from '../ApiService';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';



function MyTable() {
    const [values, setValues] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
        const toast = React.useRef(null); 
    

    const filteredValues = values.filter(item => 
        (item.orderName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const fetchOrders = async () => {
        try {
            const response = await ApiService.findAllOrders();
            setValues(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const onEdit = (rowData) => {
        console.log('Edit row:', rowData);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <Button
                    icon="pi pi-pencil"
                    severity="secondary"
                    onClick={() => onEdit(rowData)}
                    aria-label="Edit"
                    rounded
                    style={{ marginRight: '10px' }}
                />
                <Button
                    icon="pi pi-trash"
                    severity="danger"
                    onClick={() => handleDeleteConfirm(rowData.id)}
                    aria-label="Delete"
                    rounded
                />
            </div>
        );
    };

    const handleDelete = async (orderId) => {
        try {
        await ApiService.deleteOrder(orderId);
        setValues(values.filter((item) => item.id !== orderId));
        toast.current.show({
            severity: "success",
            summary: "Επιτυχία",
            detail: "Το προϊόν διαγράφηκε.",
            life: 3000,
        });
        } catch (error) {
        console.error("Σφάλμα:", error);
        toast.current.show({
            severity: "error",
            summary: "Σφάλμα",
            detail: "Αποτυχία διαγραφής προϊόντος.",
            life: 3000,
        });
        }
    };

    const handleDeleteConfirm = (orderId) => {
            confirmDialog({
            message: 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το προϊόν;',
            header: 'Επιβεβαίωση Διαγραφής',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Ναι',
            rejectLabel: 'Όχι',
            acceptClassName: 'custom-accept-button',
            rejectClassName: 'custom-reject-button',
            accept: () => handleDelete(orderId),
            reject: () => {},
            });
        };

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog /> 

            <div style={{ marginTop: '20px', padding: '20px', margin: 'auto' }}>
                <InputText
                    placeholder="Αναζήτηση..."
                    type='text'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-text-search"
                />

                <DataTable
                    value={filteredValues}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    tableStyle={{ minWidth: '50rem' }}
                >
                    <Column field="orderName" header="Ονομα Προϊόντος" style={{ width: '25%' }} className="break-word"/>
                    <Column field="description" header="Περιγραφή" style={{ width: '25%' }} className="break-word"/>
                    <Column field="quantity" header="Ποσότητα" style={{ width: '25%' }} />
                    <Column field="createdAt" header="Ημερομηνία" style={{ width: '25%' }} />
                    <Column body={actionBodyTemplate} header="" />
                </DataTable>
            </div>
        </div>
    );
}

export default MyTable;