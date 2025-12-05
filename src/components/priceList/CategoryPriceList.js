import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../ApiService';
import SharedDataTable from './SharedDataTable';
import AddItem from './AddItem';
import EditItem from './EditItem';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import '../priceList/CategoryPriceList.css';

    const CategoryPriceList = ({
        category,
        searchPlaceholder,
        headers,
        fields
    }) => {
        const [values, setValues] = useState([]);
        const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
        const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
        const [editItem, setEditItem] = useState(null);
        const toast = useRef(null);

    const fetchPrices = async () => {
        try {
        const response = await ApiService.findByCategory(category);
        setValues(response.data.data);
        } catch (error) {
        console.error(error);
        }
    };

    const handleAdd = async (productWithPrice) => {
        try {
        const response = await ApiService.addProductPrice(productWithPrice);
        if (response.status === 200) {
            toast.current.show({
            severity: "success",
            summary: "Επιτυχία",
            detail: response.data.message,
            life: 3000,
            });

            const newRow = {
            productName: response.data.data.product.name,
            priceValue: response.data.data.price.priceValue,
            id: response.data.data.product.id
            };
            setValues(prevValues => [...prevValues, newRow]);
        } else {
            toast.current.show({
            severity: "warn",
            summary: "Προειδοποίηση",
            detail: response.data.message || "Κάτι πήγε στραβά",
            life: 3000,
            });
        }
        } catch (error) {
        console.error("Σφάλμα κατά την αποθήκευση:", error);
        toast.current.show({
            severity: "error",
            summary: "Σφάλμα",
            detail: "Αποτυχία αποθήκευσης προϊόντος.",
            life: 3000,
        });
        }
    };

    const handleEdit = async (updatedItem) => {
        try {
            const payload = {
                product: {
                    id: updatedItem.id,
                    name: updatedItem.productName,
                    category: updatedItem.category,
                    status: updatedItem.status
                },
                price: {
                    priceValue: updatedItem.priceValue
                }
            };

            const response = await ApiService.updateProductWithPrice(payload);

            if (response.status === 200) {
            setValues(prevValues =>
                prevValues.map(v => v.id === updatedItem.id ? updatedItem : v)
            );

            toast.current.show({
                severity: "success",
                summary: "Επιτυχία",
                detail: "Το προϊόν ενημερώθηκε.",
                life: 3000,
            });

            setIsEditDialogVisible(false);
            }
        } catch (error) {
            console.error("Σφάλμα:", error);
            toast.current.show({
            severity: "error",
            summary: "Σφάλμα",
            detail: "Αποτυχία ενημέρωσης προϊόντος.",
            life: 3000,
            });
        }
    };

    const handleDelete = async (productId) => {
        try {
        await ApiService.deleteProduct(productId);
        setValues(values.filter((item) => item.id !== productId));
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

    const handleDeleteConfirm = (productId) => {
        confirmDialog({
        message: 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το προϊόν;',
        header: 'Επιβεβαίωση Διαγραφής',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Ναι',
        rejectLabel: 'Όχι',
        acceptClassName: 'custom-accept-button',
        rejectClassName: 'custom-reject-button',
        accept: () => handleDelete(productId),
        reject: () => {},
        });
    };

    useEffect(() => {
        fetchPrices();
    }, [category]);

    return (
        <div>
        <Toast ref={toast} />
        <ConfirmDialog />

        <SharedDataTable
            data={values}
            searchPlaceholder={searchPlaceholder}
            fields={fields}
            headers={headers}
            onAdd={() => setIsAddDialogVisible(true)}
            onEdit={(rowData) => {
                setEditItem({ ...rowData, status: rowData.status || "ACTIVE" });
                setIsEditDialogVisible(true);    
            }}
            onDelete={(rowData) => handleDeleteConfirm(rowData.id)}
        />

        <AddItem
            visible={isAddDialogVisible}
            onHide={() => setIsAddDialogVisible(false)}
            onAdd={handleAdd}
            category={category}
        />

        <EditItem
                category={category}
                visible={isEditDialogVisible}
                onHide={() => setIsEditDialogVisible(false)}
                item={editItem}
                onUpdate={(updatedItem) => handleEdit(updatedItem)}
            />
        </div>
    );
    };

export default CategoryPriceList;