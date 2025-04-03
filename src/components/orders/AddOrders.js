import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext'; 
import { Button } from 'primereact/button'; 
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'; 
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './AddOrders.css'; // Εισαγωγή του CSS αρχείου

const AddOrders = () => {
    const [entries, setEntries] = useState([{ productName: '', description: '', quantity: '' }]); 
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleAddEntry = () => {
        if (!productName || !description || !quantity) {
            alert("Παρακαλώ συμπληρώστε όλα τα πεδία.");
            return;
        }

        const newEntry = { productName, description, quantity };
        setEntries([...entries, newEntry]);
        resetForm(); // Επαναφορά της φόρμας
    };

    const resetForm = () => {
        setProductName('');
        setDescription('');
        setQuantity('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Order Entries:', entries); // Εμφάνιση των παραγγελιών στο κονσόλα
    };

    return (
        <div className="card">
            <h2>Προσθήκη Παραγγελίας</h2>
            <form onSubmit={handleSubmit}>
                <div className="field mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                    <InputText 
                        placeholder="Όνομα Προϊόντος"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        style={{ marginRight: '10px' }}
                        className='input-text'
                    />
                    <InputText 
                        placeholder="Περιγραφή"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ marginRight: '10px' }}
                        className='input-text'
                    />
                     <InputText 
                        placeholder="Ποσότητα"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        style={{ marginRight: '10px' }}
                        className='input-text'
                    />
                    <Button 
                        label="Προσθήκη" 
                        icon="pi pi-plus" 
                        onClick={handleAddEntry} 
                        className="custom-black-button"
                        rounded
                    />
                </div>
            </form>

            <h3>Συγκεντρωμένος Πίνακας Παραγγελιών</h3>
            <DataTable value={entries} style={{ marginTop: '20px' }}>
                <Column field="productName" header="Όνομα Προϊόντος" />
                <Column field="description" header="Περιγραφή" />
                <Column field="quantity" header="Ποσότητα" />
            </DataTable>
        </div>
    );
};

export default AddOrders;