import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import './AddUppdate.css';

const EditItem = ({ category, visible, onHide, onUpdate, item }) => {
  const [productName, setProductName] = useState('');
  const [priceValue, setPriceValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [status, setStatus] = useState('');

  const statusOptions = [
    { label: "Ενεργό", value: "ACTIVE" },
    { label: "Ανενεργό", value: "INACTIVE" }
  ];

  useEffect(() => {
    if (item) {
      setProductName(item.productName || '');
      setPriceValue(item.priceValue || '');
      setSelectedCategory(item.category || category || '');
      setStatus(item.status || "ACTIVE");
    }
  }, [item]);

  const handleUpdate = () => {
    const updatedItem = {
      ...item,
      productName,
      priceValue,
      category: selectedCategory,
      status
    };
    onUpdate(updatedItem);
    onHide();
  };

  return (
    <Dialog
      header="Ενημέρωση Προϊόντος"
      visible={visible}
      style={{ width: '400px' }}
      onHide={onHide}
      className="add-item-dialog"
    >
      <div className="p-field">
        <label className="center-label">Όνομα Προϊόντος</label>
        <div className="input-field-wrapper">
            <InputText value={productName} onChange={(e) => setProductName(e.target.value)} />
        </div>
        <label className="center-label">Τιμή</label>
        <div className="input-field-wrapper">
            <InputText value={priceValue} onChange={(e) => setPriceValue(e.target.value)} />
        </div>
        <label className="center-label">Κατηγορία</label>
        <div className="input-field-wrapper">
            <InputText value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} disabled />
        </div>
        <label className="center-label">Κατάσταση</label>
        <div className="input-field-wrapper">
        <Dropdown
            placeholder="Κατάσταση"
            value={status}
            options={statusOptions}
            onChange={(e) => setStatus(e.value)}
            className="dropdown-status"
        />
        </div>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button 
            label="Αποθήκευση"  
            onClick={handleUpdate} 
            className="save-button-pricelist" 
        />
      </div>
    </Dialog>
  );
};

export default EditItem;