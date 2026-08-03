import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import ApiService from "../../ApiService";

const PosScreenCameraSelect = () => {
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState("");
  const [order, setOrder] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);

  const baseDto = {
    product: {
      name: "",
      description: "",
      category: "Ψωμί",
      status: "ACTIVE",
      priceIds: []
    },
    price: {
      priceValue: 1.20,
      supplierPrice: 0.60,
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      productIds: [],
      supplierId: 1
    }
  };

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    // Λίστα καμερών
    codeReader.listVideoInputDevices()
      .then((videoInputDevices) => {
        setCameras(videoInputDevices);
        if (videoInputDevices.length > 0) {
          setSelectedCameraId(videoInputDevices[0].deviceId); // default πρώτη κάμερα
        }
      })
      .catch(err => console.error(err));

    return () => codeReader.reset();
  }, []);

  useEffect(() => {
    if (!selectedCameraId) return;

    const codeReader = new BrowserMultiFormatReader();

    navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: selectedCameraId } } })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        codeReader.decodeFromVideoDevice(selectedCameraId, videoRef.current, async (result, err) => {
          if (result) {
            const code = result.getText();
            setBarcode(code);
            codeReader.reset(); // σταματάει scanning για λίγο
            await handleScan(code);
          }
        });
      })
      .catch(err => console.error("Camera error:", err));

    return () => codeReader.reset();
  }, [selectedCameraId]);

  const handleScan = async (code) => {
    if (!code) return;
    setLoading(true);

    try {
      let orderId = currentOrderId;
      if (!orderId) {
        const createRes = await ApiService.createOrder();
        orderId = createRes.data.id;
        setCurrentOrderId(orderId);
      }

      const payload = {
        orderId,
        barcode: code,
        dto: baseDto
      };

      const res = await ApiService.addProductByBarcode(payload);
      setOrder(res.data);
      setBarcode("");
    } catch (err) {
      console.error("Error scanning product:", err);
      alert("Σφάλμα κατά την προσθήκη του προϊόντος.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🧾 POS Ταμειακή με Επιλογή Κάμερας</h1>

      <div>
        <label>Επιλογή κάμερας: </label>
        <select onChange={(e) => setSelectedCameraId(e.target.value)} value={selectedCameraId}>
          {cameras.map(cam => (
            <option key={cam.deviceId} value={cam.deviceId}>{cam.label || "Camera " + cam.deviceId}</option>
          ))}
        </select>
      </div>

      <video ref={videoRef} width="300" height="200" style={{ border: "1px solid black", marginTop: 10 }} />
      <p>Detected barcode: {barcode}</p>

      {loading && <p>⏳ Ανάγνωση...</p>}

      {order && (
        <>
          <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Προϊόν</th>
                <th>Ποσ.</th>
                <th>Τιμή</th>
                <th>Σύνολο</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toFixed(2)} €</td>
                  <td>{(item.price * item.quantity).toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Σύνολο: {order.totalAmount.toFixed(2)} €</h2>
          <button style={{ fontSize: 22, padding: 10, marginTop: 20 }}>💳 Πληρωμή</button>
        </>
      )}
    </div>
  );
};

export default PosScreenCameraSelect;