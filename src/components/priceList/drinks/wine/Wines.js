import React, { useState, useEffect } from 'react';
import SharedDataTable from '../../../SharedDataTable';

 const Wines = () => {
    const [values, setValues] = useState([]);

    const headers = ['Όνομα Προϊόντος', 'Ποσότητα Προϊόντων', 'Τιμή Προϊόντος'];

    return (
        <SharedDataTable 
            data={values} 
            searchPlaceholder="Αναζήτηση για ψωμιά" 
            fields={['name', 'quantity', 'price']}
            headers={headers} 
        />
    );
};

export default Wines;