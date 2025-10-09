import CategoryPriceList from '../../CategoryPriceList';

const Beers = () => (
    <CategoryPriceList
        category="Μπύρα"
        searchPlaceholder="Αναζήτηση για μπύρες"
        headers={['Όνομα Προϊόντος', 'Τιμή Προϊόντος']}
        fields={['productName', 'priceValue']}
    />
);

export default Beers;