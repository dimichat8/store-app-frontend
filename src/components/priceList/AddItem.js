import React, { useState, useEffect, useRef  } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import './AddItem.css';
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";

const AddItem = ({ visible, onHide, onAdd, category }) => {
  const toast = useRef(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
    priceValue: "",
    supplierPrice: "",
    validFrom: "",
    validTo: ""
  });
    
  const statusOptions = [
    { label: "Ενεργό", value: "ACTIVE" },
    { label: "Ανενεργό", value: "INACTIVE" }
  ];

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, value) => {
    if (value instanceof Date || value === null) {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  const handleAdd = () => {
    let newErrors = [];

    if (!newItem.name) newErrors.push("Όνομα");
    if (!newItem.priceValue) newErrors.push("Τιμή");

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

    const fromDate = newItem.validFrom ? new Date(newItem.validFrom) : null;
    const toDate = newItem.validTo ? new Date(newItem.validTo) : null;

    const productWithPrice = {
      product: {
        name: newItem.name,
        description: newItem.description,
        status: newItem.status,
        category: category
      },
      price: {
        priceValue: newItem.priceValue ? parseFloat(newItem.priceValue) : null,
        supplierPrice: newItem.supplierPrice ? parseFloat(newItem.supplierPrice) : null,
        validFrom: fromDate ? fromDate.toLocaleDateString('en-CA') : null,
        validTo: toDate ? toDate.toLocaleDateString('en-CA') : null
      }
    };

    onAdd(productWithPrice);
    toast.current.show({
      severity: "success",
      summary: "Επιτυχία",
      detail: "Το προϊόν προστέθηκε με επιτυχία!",
      life: 3000,
    });
    onHide();

  };

  return (
    <>
    <Toast ref={toast} />
      <Dialog
        header="Προσθήκη Προϊόντος"
        visible={visible}
        onHide={onHide}
        modal
        className="add-item-dialog"
      >
        <div className="p-fluid">
          <label className="center-label">Όνομα <span>*</span></label>
          <div className="input-field-wrapper">
            <InputText
              name="name"
              value={newItem.name}
              onChange={handleChange}
            />
          </div>
          <label className="center-label">Τιμή <span>*</span></label>
          <div className="input-field-wrapper">
            <InputText
              name="priceValue"
              value={newItem.priceValue}
              onChange={handleChange}          
              />
          </div>

          {/* <label className="center-label">Τιμή Προμηθευτή</label>
          <div className="input-field-wrapper">
            <InputText
              name="supplierPrice"
              value={newItem.supplierPrice}
              onChange={handleChange}
            />
          </div> */}

          <label className="center-label">Ημερομηνία Έναρξης</label>
          <div className="input-field-wrapper">
            <Calendar
              value={newItem.validFrom}
              onChange={(e) => handleDateChange('validFrom', e.value)}
              selectionMode="single"
              placeholder="Από (dd/mm/yy)"
              dateFormat="dd/mm/yy"
              showIcon
              className="custom-calendar"
            />
          </div>

          <label className="center-label">Ημερομηνία Λήξης</label>
          <div className="input-field-wrapper">
            <Calendar
              value={newItem.validTo}
              onChange={(e) => handleDateChange('validTo', e.value)}
              selectionMode="single"
              placeholder="Έως (dd/mm/yy)"
              dateFormat="dd/mm/yy"
              showIcon
              className="custom-calendar"
            />
          </div>

          {/* <label className="center-label">Περιγραφή</label>
          <div className="input-field-wrapper">
            <InputText
              name="description"
              value={newItem.description}
              onChange={handleChange}
            />
          </div> */}

          <label className="center-label">Κατηγορία</label>
          <div className="input-field-wrapper">
            <InputText
              name="category"
              value={category}
              disabled
            />
          </div>

          <label className="center-label">Κατάσταση</label>
          <Dropdown
            placeholder="Κατάσταση"
            value={newItem.status}
            options={statusOptions}
            onChange={(e) => setNewItem({ ...newItem, status: e.value })}
            className="dropdown-status"
          />

          {/* <label className="center-label">Price IDs (π.χ. 1,2,3)</label>
          <div className="input-field-wrapper">
            <InputText
              value={newItem.priceIds.join(",")}
              onChange={handlePriceIdsChange}
            />
          </div> */}

          <Button
            label="Αποθήκευση"
            onClick={handleAdd}
            className="save-button-pricelist"
          />
        </div>
      </Dialog>
    </>
  );
};

export default AddItem;