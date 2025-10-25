import React from 'react';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';

function GroupRow({ group, onDelete }) {
    const handleDeleteConfirm = () => {
        confirmDialog({
            message: `Είστε σίγουροι ότι θέλετε να διαγράψετε το group από ${group.from} έως ${group.to};`,
            header: 'Επιβεβαίωση Διαγραφής',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Ναι',
            rejectLabel: 'Όχι',
            acceptClassName: 'custom-accept-button',
            rejectClassName: 'custom-reject-button',
            accept: () => onDelete(group),
            reject: () => {},
        });
    };

    return (
        <Button
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={handleDeleteConfirm}
            rounded
        />
    );
}

export default GroupRow;