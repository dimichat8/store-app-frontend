import BarcodeScanner from '../barcode/BarcodeScanner ';
import CategoryPriceList from '../CategoryPriceList';

const BreadList = () => (
    <div>
        <CategoryPriceList
            category="Ψωμί"
            searchPlaceholder="Αναζήτηση για ψωμιά"
            headers={['Όνομα Προϊόντος', 'Τιμή Προϊόντος']}
            fields={['productName', 'priceValue']}
        />
        <BarcodeScanner />
    </div>
);
export default BreadList;