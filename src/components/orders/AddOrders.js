import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import './AddOrders.css';
import ApiService from '../ApiService';

const AddOrders = () => {
    const [orderName, setOrderName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [createdAt, setCreatedAt] = useState(new Date());
    const [orderList, setOrderList] = useState([]);
    const toast = useRef(null);

    const handleAddOrder = () => {
       let newErrors = [];

        if (!orderName) newErrors.push("Τίτλος");
        if (!description) newErrors.push("Σημείωση");

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

        if (isNaN(quantity)) {
            toast.current.show({ severity: 'error', summary: 'Σφάλμα', detail: 'Η ποσότητα πρέπει να είναι αριθμός.', life: 3000 });
            return;
        }

        setOrderList(prev => [...prev, {
            orderName,
            description,
            quantity,
            createdAt
        }]);

        setOrderName('');
        setDescription('');
        setQuantity('');
    };

    const handleDeleteOrder = (rowData) => {
        setOrderList(prev => prev.filter(order => order !== rowData));
    };

    const handleSaveAll = async () => {
    if (orderList.length === 0) return;

    const pad = (n) => n < 10 ? '0' + n : n;
    const payload = orderList.map(order => ({
        orderName: order.orderName,
        description: order.description,
        quantity: parseInt(order.quantity, 10),
        createdAt: `${order.createdAt.getFullYear()}-${pad(order.createdAt.getMonth() + 1)}-${pad(order.createdAt.getDate())}` // YYYY-MM-DD
    }));

    try {
        const response = await ApiService.addOrders(payload);
        if (response.status === 200) {
            toast.current.show({ severity: 'success', summary: 'Επιτυχία', detail: response.data.message, life: 3000 });
            setOrderList([]);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Προειδοποίηση', detail: response.data.message || 'Κάτι πήγε στραβά', life: 3000 });
        }
    } catch (error) {
        console.error(error.response?.data || error);
        toast.current.show({ severity: 'error', summary: 'Σφάλμα', detail: 'Αποτυχία αποθήκευσης παραγγελιών.', life: 3000 });
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
                rounded onClick={() => handleDeleteOrder(rowData)} 
            />
        </div>
    );

    return (
        <div>
            <h2>Προσθήκη Παραγγελίας</h2>
            <div className="card">
                <Toast ref={toast} />

                <div className="input-row">
                    <InputText 
                        className="input-text-order" 
                        placeholder="Όνομα Προϊόντος" 
                        value={orderName} 
                        onChange={(e) => setOrderName(e.target.value)} 
                    />
                    <InputText 
                        className="input-text-order" 
                        placeholder="Περιγραφή" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                    <InputText 
                        className="input-text-order" 
                        placeholder="Ποσότητα" 
                        value={quantity} 
                        onChange={(e) => setQuantity(e.target.value)} 
                    />
                </div>

                <div className="button-row" style={{ marginTop: '10px' }}>
                    <Button 
                        className="custom-black-button" 
                        label="Προσθήκη" 
                        icon="pi pi-plus" 
                        onClick={handleAddOrder} 
                        rounded 
                    />
                    <Button 
                        className="custom-black-button" 
                        label="Αποθήκευση" 
                        icon="pi pi-save" 
                        onClick={handleSaveAll} 
                        rounded 
                        style={{ marginLeft: '10px' }} 
                    />
                </div>

                <DataTable value={orderList} style={{ marginTop: '20px' }}>
                    <Column field="orderName" header="Όνομα Προϊόντος" />
                    <Column field="description" header="Περιγραφή" />
                    <Column field="quantity" header="Ποσότητα" />
                    <Column field="createdAt" header="Ημερομηνία" body={(row) => row.createdAt.toLocaleDateString()} />
                    <Column body={actionBodyTemplate} header="Ενέργειες" style={{ textAlign: 'center', width: '150px' }} />
                </DataTable>
            </div>
        </div>
    );
};

export default AddOrders;
