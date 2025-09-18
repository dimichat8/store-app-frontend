import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const SharedDataTable = ({
  data,
  searchPlaceholder,
  fields,
  headers,
  onEdit, 
  onDelete, 
  onAdd 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item =>
    fields.some(field =>
      item[field].toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <Button
          icon="pi pi-pencil"
          severity="secondary"
          onClick={() => onEdit(rowData)}
          aria-label="Edit"
          rounded
          style={{ marginRight: '10px' }}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          onClick={() => onDelete(rowData)}
          aria-label="Delete"
          rounded
        />
      </div>
    );
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <InputText
          placeholder={searchPlaceholder}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="input-text-search"
        />
        <Button 
          icon="pi pi-plus" 
          onClick={onAdd} 
          style={{ marginRight: '20px' }}
          className="add-button"
          rounded
        />
      </div>
      <DataTable
        value={filteredData}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '50rem' }}
      >
        {fields.map((field, index) => (
          <Column key={index} field={field} header={headers[index]} style={{ width: '25%' }} />
        ))}
        <Column body={actionBodyTemplate} header="Δράσεις" />
      </DataTable>
    </div>
  );
};

export default SharedDataTable;