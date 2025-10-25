import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import ApiService from "../ApiService";
import "../register/Register.css";
import { Dropdown } from "primereact/dropdown";

const Register = ({ visible, setVisible }) => {
  const [newItem, setNewItem] = useState({
    username: "",
    password: "",
    email: "",
    roles: "USER",
  });

  const roleOptions = [
    { label: "Διαχειριστής", value: "ADMIN" },
    { label: "Χρήστης", value: "USER" }
  ];

  const toast = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const { username, password, email } = newItem;
    let newErrors = [];
    if (!username) newErrors.push("Όνομα");
    if (!password) newErrors.push("Κωδικός");
    if (!email) newErrors.push("Email");

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

    try {
      const response = await ApiService.register(newItem);
      toast.current.show({
        severity: "success",
        summary: "Επιτυχία",
        detail: "Ο χρήστης δημιουργήθηκε επιτυχώς!",
        life: 1000,
      });
      console.log("User registered:", response.data);
      setTimeout(() => {
        setNewItem({ username: "", password: "", email: "", roles: "" });
            setVisible(false);
        }, 2000
      );
    
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "Η εγγραφή απέτυχε. Δοκιμάστε ξανά.";

      console.error("Registration error:", error.response?.data);

      toast.current.show({
        severity: "error",
        summary: "Σφάλμα",
        detail: backendMessage,
        life: 2000,
      });
    }
  };

  return (
    <Dialog
      header="Εγγραφή"
      visible={visible}
      onHide={() => {
        setNewItem({ username: "", password: "", email: "", roles: "USER" });
        setVisible(false);
      }}
      modal
      className="add-item-dialog"
    >
        <Toast ref={toast} />

        <form
        onSubmit={(e) => {
        e.preventDefault();
        handleAdd();
        }}>
        <div className="p-fluid">
            <label className="center-label">
            Όνομα <span>*</span>
            </label>
            <InputText
            name="username"
            value={newItem.username}
            onChange={handleChange}
            className="input-text-register"
            />

        <div className="p-field" style={{ position: "relative" }}>
            <label className="center-label">
                Κωδικός <span>*</span>
            </label>
            <InputText
                name="password"
                type={showPassword ? "text" : "password"}
                value={newItem.password}
                onChange={handleChange}
                className="input-text-register"
            />
            <Button
                type="button" 
                icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}
                className="eye-button"
                onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
                }}
                tabIndex={-1}
            />
            </div>

            <label className="center-label">
            Email <span>*</span>
            </label>
            <InputText name="email"
            value={newItem.email} 
            onChange={handleChange} 
            className="input-text-register"
            />

            <label className="center-label">Ρόλος</label>
            <Dropdown
                placeholder="Κατάσταση"
                value={newItem.roles}
                options={roleOptions}
                onChange={(e) => setNewItem({ ...newItem, roles: e.value })}
                className="dropdown-status"
            />
            <Button
                type="submit"
                label="Αποθήκευση"
                icon="pi pi-check"
                className="save-button-register"
            />
        </div>
        </form>
    </Dialog>
  );
};

export default Register;