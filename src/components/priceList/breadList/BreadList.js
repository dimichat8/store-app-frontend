import React, { useState, useEffect } from 'react';
import SharedDataTable from '../../SharedDataTable';
import mockValues from './mockdata';

 const BreadList = () => {
    const [values, setValues] = useState(mockValues);

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

export default BreadList;