import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SharedDataTable from '../../../SharedDataTable';
import AddItem from '../../../AddItem';

 const Drinks = () => {
    const [values, setValues] = useState([]);
    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);

    const category = 'Ποτά';
    const headers = ['Όνομα Προϊόντος', 'Τιμή Προϊόντος'];

    const fetchPrices = async () => {
        try {
        const response = await axios.get(`http://localhost:8080/price/find/byCategory`, {
            params: { category }
        });
        console.log(response.data);
        setValues(response.data.data);
        } catch (error) {
        console.error(error);
        }
    };

    useEffect(() => {
        fetchPrices();
    }, [category]);

    const handleAdd = (newProduct) => {
        setValues([...values, newProduct]);
    };

    return (
        <div>
            <SharedDataTable 
                data={values} 
                searchPlaceholder="Αναζήτηση για ποτά" 
                fields={['name', 'quantity', 'price']}
                headers={headers} 
                onAdd={() => setIsAddDialogVisible(true)}
            />

            <AddItem
                visible={isAddDialogVisible}
                onHide={() => setIsAddDialogVisible(false)}
                onAdd={handleAdd} 
                category={category}
            />
        </div>
    );
};

export default Drinks;