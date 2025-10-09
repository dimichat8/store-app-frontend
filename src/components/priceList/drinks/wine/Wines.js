import CategoryPriceList from '../../CategoryPriceList';

 const Wines = () => (
    <CategoryPriceList
        category="Μπύρα"
        searchPlaceholder="Αναζήτηση για κρασιά"
        headers={['Όνομα Προϊόντος', 'Τιμή Προϊόντος']}
        fields={['productName', 'priceValue']}
    />
);

export default Wines;