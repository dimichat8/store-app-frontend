import CategoryPriceList from '../../CategoryPriceList';

 const Drinks = () => (
    <CategoryPriceList
        category="Μπύρα"
        searchPlaceholder="Αναζήτηση για ποτά"
        headers={['Όνομα Προϊόντος', 'Τιμή Προϊόντος']}
        fields={['productName', 'priceValue']}
    />
);
export default Drinks;