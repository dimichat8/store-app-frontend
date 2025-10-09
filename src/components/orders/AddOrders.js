import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './AddOrders.css';

const AddOrders = () => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [orderList, setOrderList] = useState([]);

    const handleAddOrder = () => {
        if (!productName || !description || !quantity) return;

        const newOrder = { productName, description, quantity };
        setOrderList((prev) => [...prev, newOrder]);
        setProductName('');
        setDescription('');
        setQuantity('');
    };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Order Entries:', orderList);
    };

    return (
        <div>
            <h2>Προσθήκη Παραγγελίας</h2>
                <div className="order-container">
                    <div className="input-row">
                        <InputText
                        placeholder="Όνομα Προϊόντος"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="input-text-order"
                        />
                        <InputText
                        placeholder="Περιγραφή"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input-text-order"
                        />
                        <InputText
                        placeholder="Ποσότητα"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="input-text-order"
                        />
                    </div>

                    <div className="button-row">
                        <Button
                        label="Προσθήκη Παραγγελίας"
                        icon="pi pi-plus"
                        onClick={handleAddOrder}
                        className="custom-black-button"
                        rounded
                        />
                        <Button
                        label="Αποθήκευση Όλων"
                        icon="pi pi-save"
                        onClick={handleSubmit}
                        className="custom-black-button"
                        rounded
                        />
                    </div>
                    </div>
            

            <h3>Πίνακας Παραγγελιών</h3>
            <DataTable value={orderList} style={{ marginTop: '20px' }}>
                <Column field="productName" header="Όνομα Προϊόντος" />
                <Column field="description" header="Περιγραφή" />
                <Column field="quantity" header="Ποσότητα" />
            </DataTable>
        </div>
    );
};

export default AddOrders;