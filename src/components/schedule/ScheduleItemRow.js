import React from 'react';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';

function ScheduleItemRow({ item, onDelete }) {
    const handleDeleteConfirm = () => {
        confirmDialog({
            message: 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή τη βάρδια;',
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
        <Button
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={handleDeleteConfirm}
            rounded
        />
    );
}

export default ScheduleItemRow;