import CategoryPriceList from '../../CategoryPriceList';

  const CookedPizza = () => (
    <CategoryPriceList
      category="Μπύρα"
      searchPlaceholder="Αναζήτηση για ψημένες πίτσες"
      headers={['Όνομα Προϊόντος', 'Τιμή Προϊόντος']}
      fields={['productName', 'priceValue']}
    />
);

  export default CookedPizza;


