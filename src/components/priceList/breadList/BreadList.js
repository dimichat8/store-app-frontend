import React, { useState, useEffect } from 'react';
import SharedDataTable from '../../SharedDataTable';
import axios from "axios";
import AddItem from '../../AddItem';

 const BreadList = () => {
    const [values, setValues] = useState([]);
    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);

    const category ='Ψωμί'
    const headers = ['Όνομα Προϊόντος', 'Τιμή Προϊόντος'];

    const fetchPrices = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/price/find/byCategory`, {
                params: { category }
            });
            setValues(response.data.data);
        } catch (error) {
            console.error("Σφάλμα:", error);
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
                searchPlaceholder="Αναζήτηση για ψωμιά" 
                fields={['productName', 'priceValue']}
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

export default BreadList;