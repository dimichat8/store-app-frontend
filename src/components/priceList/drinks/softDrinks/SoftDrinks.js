import CategoryPriceList from '../../CategoryPriceList';

 const SoftDrinks = () => (
    <CategoryPriceList
        category="Αναψυκτικά"
        searchPlaceholder="Αναζήτηση για αναψυκτικά"
        headers={['Όνομα Προϊόντος', 'Τιμή Προϊόντος']}
        fields={['productName', 'priceValue']}
    />
);

export default SoftDrinks;