"use client";

import React, { useState } from "react";
import useAddress from "@/lib/hooks/useAddress";

export default function TestAddAddressPage() {
  const { addAddress, loading, error } = useAddress();

  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleAdd = async () => {
    if (!addressLine1 || !city || !phone || !pinCode || !country) {
      alert("Please fill all required fields");
      return;
    }

    await addAddress({
      address_line1: addressLine1,
      address_line2: "",
      city,
      phone,
      pin_code: pinCode,
      country,
      is_default: isDefault,
    });

    // Clear inputs
    setAddressLine1("");
    setCity("");
    setPhone("");
    setPinCode("");
    setCountry("");
    setIsDefault(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Add Address</h1>

      <input
        type="text"
        placeholder="Address Line 1"
        value={addressLine1}
        onChange={(e) => setAddressLine1(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Pin Code"
        value={pinCode}
        onChange={(e) => setPinCode(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <br />

      <label>
        Is Default:{" "}
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
        />
      </label>
      <br />

      <button onClick={handleAdd} disabled={loading}>
        {loading ? "Adding..." : "Add Address"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
