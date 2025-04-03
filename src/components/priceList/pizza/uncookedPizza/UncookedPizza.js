import React, { useState, useEffect } from 'react';
import SharedDataTable from '../../SharedDataTable';

const UncookedPizza = () => {
    const [values, setValues] = useState([]);

  //   useEffect(() => {
  //     setValues(mockValues); 
  // }, []);

    const headers = ['Όνομα Προϊόντος', 'Ποσότητα Προϊόντων', 'Τιμή Προϊόντος'];

    return (
        <SharedDataTable 
            data={values} 
            searchPlaceholder="Αναζήτηση για πίτσες άψητες" 
            fields={['name', 'quantity', 'price']}
            headers={headers} 
        />
    );
  };

export default UncookedPizza;