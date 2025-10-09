import CategoryPriceList from '../CategoryPriceList';

const BreadList = () => (
    <CategoryPriceList
        category="Ψωμί"
        searchPlaceholder="Αναζήτηση για ψωμιά"
        headers={['Όνομα Προϊόντος', 'Τιμή Προϊόντος']}
        fields={['productName', 'priceValue']}
    />
);

export default BreadList;