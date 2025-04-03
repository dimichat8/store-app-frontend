import React, { useState, useEffect } from 'react';
import SharedDataTable from '../../SharedDataTable';
import mockValuesBreakfast from './mockdataBreakfast';


const Breakfast = () => {
  const [values, setValues] = useState(mockValuesBreakfast); 

  const headers = ['Όνομα Προϊόντος', 'Ποσότητα Προϊόντων', 'Τιμή Προϊόντος'];

  return (
      <SharedDataTable 
          data={values} 
          searchPlaceholder="Αναζήτηση για πρωινά" 
          fields={['name', 'quantity', 'price']} 
          headers={headers} 
      />
  );
};

export default Breakfast;


// import React, { useState, useEffect } from 'react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { InputText } from 'primereact/inputtext';
// import mockValuesBreakfast from './mockdataBreakfast';


// export default function Βreakfast () {
//   const [values, setValues] = useState(mockValuesBreakfast);
//     const [searchTerm, setSearchTerm] = useState(''); 

//     const filteredCustomers = values.filter(value => 
//       value.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//       value.quantity.toString().toLowerCase().includes(searchTerm.toLowerCase()) || 
//       value.price.toString().toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSearchChange = (e) => {
//       setSearchTerm(e.target.value); 
//   };

//     return (
//         <div className="card">
//            <div className="card">
//             <InputText 
//                 placeholder="Αναζήτηση" 
//                 type="text" 
//                 value={searchTerm} 
//                 onChange={handleSearchChange} 
//                 className="search-input mr-2"
//             />

//             <DataTable value={filteredCustomers} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
//                 <Column field="name" header="Όνομα" style={{ width: '25%' }}></Column>
//                 <Column field="quantity" header="Ποσότητα" style={{ width: '25%' }}></Column>
//                 <Column field="price" header="Τιμή" style={{ width: '25%' }}></Column>
//             </DataTable>
//             </div>
//         </div>
//     );
//   }; 