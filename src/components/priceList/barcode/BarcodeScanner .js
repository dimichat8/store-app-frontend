import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import ApiService from "../../ApiService";

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);

  const [productData, setProductData] = useState({
    product: {
      id: null,
      name: "",
      description: "",
      category: "",
      status: "ACTIVE",
      priceIds: []
    },
    price: {
      id: null,
      priceValue: 0,
      supplierPrice: 0,
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      productIds: [],
      supplierId: null
    }
  });

  // Φόρτωμα διαθέσιμων καμερών
  useEffect(() => {
    const getCameras = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === "videoinput");
      setCameras(videoDevices);
      if (videoDevices.length > 0) setSelectedCameraId(videoDevices[0].deviceId);
    };
    getCameras();
  }, []);

  // Start scanning
  const startScanning = async () => {
    if (scanning) return;
    if (!selectedCameraId) {
      alert("No camera selected!");
      return;
    }
    setScanning(true);

    // Stop previous video if exists
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedCameraId } }
      });
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch(err => console.warn("Video play error:", err));
      };

      codeReader.decodeFromVideoDevice(selectedCameraId, videoRef.current, (result, err) => {
        if (result) {
          setBarcode(result.getText());
          console.log("Barcode detected:", result.getText());
          // Αν θέλεις, μπορείς να σταματήσεις εδώ με stopScanning();
        }
        if (err && err.name !== "NotFoundException") {
          console.error("ZXing error:", err);
        }
      });
    } catch (err) {
      console.error("Camera error:", err);
      alert("Cannot access webcam. Please allow camera access.");
      setScanning(false);
    }
  };

  // Stop scanning
  const stopScanning = () => {
    setScanning(false);
    if (codeReaderRef.current) codeReaderRef.current.reset();
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleSubmit = async () => {
    if (!barcode) {
      alert("No barcode detected!");
      return;
    }

    try {
      await ApiService.saveProductWithBarcode(productData, barcode);
      alert("Product saved!");

      // Reset για επόμενο scan
      setBarcode("");
      setProductData({
        product: { id: null, name: "", description: "", category: "", status: "ACTIVE", priceIds: [] },
        price: { id: null, priceValue: 0, supplierPrice: 0, validFrom: "2026-01-01", validTo: "2026-12-31", productIds: [], supplierId: null }
      });
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  };

  return (
    <div style={{ border: "1px solid gray", padding: "10px", maxWidth: "400px" }}>
      <h2>Barcode Scanner</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>Select Camera: </label>
        <select
          value={selectedCameraId || ""}
          onChange={(e) => setSelectedCameraId(e.target.value)}
        >
          {cameras.map(cam => (
            <option key={cam.deviceId} value={cam.deviceId}>{cam.label || `Camera ${cam.deviceId}`}</option>
          ))}
        </select>
      </div>

      <video
        ref={videoRef}
        width="300"
        height="200"
        style={{ border: "1px solid black", marginBottom: "10px" }}
      />

      <p>Detected barcode: <b>{barcode || "none"}</b></p>

      <button onClick={startScanning} disabled={scanning}>
        {scanning ? "Scanning..." : "Start Scan"}
      </button>
      {scanning && <button onClick={stopScanning} style={{ marginLeft: "10px" }}>Stop Scan</button>}

      <h3>Product Info</h3>
      <input
        type="text"
        placeholder="Product name"
        value={productData.product.name}
        onChange={e =>
          setProductData({
            ...productData,
            product: { ...productData.product, name: e.target.value }
          })
        }
        style={{ width: "100%", marginBottom: "5px" }}
      />
      <input
        type="text"
        placeholder="Product description"
        value={productData.product.description}
        onChange={e =>
          setProductData({
            ...productData,
            product: { ...productData.product, description: e.target.value }
          })
        }
        style={{ width: "100%", marginBottom: "5px" }}
      />
      <input
        type="text"
        placeholder="Category"
        value={productData.product.category}
        onChange={e =>
          setProductData({
            ...productData,
            product: { ...productData.product, category: e.target.value }
          })
        }
        style={{ width: "100%", marginBottom: "5px" }}
      />

      <h3>Price Info</h3>
      <input
        type="number"
        placeholder="Price Value"
        value={productData.price.priceValue}
        onChange={e =>
          setProductData({
            ...productData,
            price: { ...productData.price, priceValue: parseFloat(e.target.value) }
          })
        }
        style={{ width: "100%", marginBottom: "5px" }}
      />
      <input
        type="number"
        placeholder="Supplier Price"
        value={productData.price.supplierPrice}
        onChange={e =>
          setProductData({
            ...productData,
            price: { ...productData.price, supplierPrice: parseFloat(e.target.value) }
          })
        }
        style={{ width: "100%", marginBottom: "5px" }}
      />

      <button onClick={handleSubmit} disabled={!barcode} style={{ marginTop: "10px" }}>
        Save Product
      </button>
    </div>
  );
};

export default BarcodeScanner;