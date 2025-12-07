import React from 'react';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';

function ItemRow({ item, onEdit, onDelete }) {

    const handleDeleteConfirm = () => {
        confirmDialog({
            message: 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την παραγγελία;',
            header: 'Επιβεβαίωση Διαγραφής',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Ναι',
            rejectLabel: 'Όχι',
            acceptClassName: 'custom-accept-button',
            rejectClassName: 'custom-reject-button',
            accept: () => onDelete(item.id),
            reject: () => {},
        });
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <Button
                    icon="pi pi-pencil"
                    severity="secondary"
                    onClick={() => onEdit(item)}
                    aria-label="Edit"
                    rounded
                    style={{ marginRight: '10px' }}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={handleDeleteConfirm}
                rounded
            />
        </div>
    );
}

export default ItemRow;