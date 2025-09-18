import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios";
import './AddItem.css';
import { Dropdown } from "primereact/dropdown";


const AddItem = ({visible, onHide, onAdd, category}) => {
    const [newItem, setNewItem] = useState({
        name: "",
        description: "",
        category: "",
        status: "",
        priceIds: [] 
    });

    const handleChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    }

      const handlePriceIdsChange = (e) => {
    setNewItem({
      ...newItem,
      priceIds: e.target.value
        .split(",")
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id))
    });
  };

  const handleAdd = async () => {
    try {
        const res = await axios.post("http://localhost:8083/product/add", newItem);
        onAdd(res.data); 
        onHide(); 
        setNewItem({ name: "", description: "", category: "", status: "", priceIds: [] });
    } catch (err) {
        console.error(err);
        alert("Κάτι πήγε στραβά!");
    }
    };

   return (
    <Dialog header="Προσθήκη Προϊόντος" visible={visible} onHide={onHide} modal className="add-item-dialog">
      <div className="p-fluid">
        <label className="center-label">Όνομα</label>
        <div className="input-field-wrapper">
          <InputText  
              name="name" 
              value={newItem.name} 
              onChange={handleChange}
          />
        </div>
        <label className="center-label">Περιγραφή</label>
        <div className="input-field-wrapper">
          <InputText 
              name="description" 
              value={newItem.description} 
              onChange={handleChange} 
          />
        </div>
        <label className="center-label">Κατηγορία</label>
        <div className="input-field-wrapper">      
          <InputText 
              name="category" 
              value={category} 
          />
        </div>
        <label className="center-label">Κατάσταση</label>
        <div className="input-field-wrapper">
          <InputText 
              name="status" 
              value={newItem.status} 
              onChange={handleChange} 
          />
        </div>
        <label className="center-label">Price IDs (π.χ. 1,2,3)</label>
        <div className="input-field-wrapper">
          <InputText 
              value={newItem.priceIds.join(",")} 
              onChange={handlePriceIdsChange} 
          />
        </div>
        <Button label="Αποθήκευση" onClick={handleAdd} className="save-button-pricelist" />
      </div>
    </Dialog>
  );
};

export default AddItem;
