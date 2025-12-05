import CategoryPriceList from '../../CategoryPriceList';

 const Wines = () => (
    <CategoryPriceList
        category="Κρασιά"
        searchPlaceholder="Αναζήτηση για κρασιά"
        headers={['Όνομα Προϊόντος', 'Τιμή Προϊόντος']}
        fields={['productName', 'priceValue']}
    />
);

export default Wines;