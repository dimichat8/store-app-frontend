import CategoryPriceList from '../CategoryPriceList';

const Breakfast = () => (
    <CategoryPriceList
        category="Πρωινό"
        searchPlaceholder="Αναζήτηση για πρωινά"
        headers={['Όνομα Προϊόντος', 'Τιμή Προϊόντος']}
        fields={['productName', 'priceValue']}
    />
);

export default Breakfast;