import CategoryPriceList from '../../CategoryPriceList';

const UncookedPizza = () => (
    <CategoryPriceList
      category="Άψητες Πίτσες"
      searchPlaceholder="Αναζήτηση για άψητες πίτσες"
      headers={['Όνομα Προϊόντος', 'Τιμή Προϊόντος']}
      fields={['productName', 'priceValue']}
    />
);

export default UncookedPizza;