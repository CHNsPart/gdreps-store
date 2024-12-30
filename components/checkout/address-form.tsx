'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressFormProps {
  onComplete: (address: string) => void;
}

export default function AddressForm({ onComplete }: AddressFormProps) {
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US"
  });

  useEffect(() => {
    // Check if all required fields are filled and notify parent
    if (address.line1 && address.city && address.state && address.postalCode) {
      const formattedAddress = `${address.line1}${address.line2 ? `, ${address.line2}` : ''}, ${address.city}, ${address.state} ${address.postalCode}`;
      onComplete(formattedAddress);
    }
  }, [address, onComplete]); // Add effect dependencies

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <Label htmlFor="line1">Address Line 1</Label>
        <Input
          id="line1"
          name="line1"
          value={address.line1}
          onChange={handleChange}
          placeholder="Street address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="line2">Address Line 2 (Optional)</Label>
        <Input
          id="line2"
          name="line2"
          value={address.line2}
          onChange={handleChange}
          placeholder="Apartment, suite, etc."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={address.city}
            onChange={handleChange}
            placeholder="City"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={address.state}
            onChange={handleChange}
            placeholder="State"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="postalCode">Postal Code</Label>
        <Input
          id="postalCode"
          name="postalCode"
          value={address.postalCode}
          onChange={handleChange}
          placeholder="Postal code"
          required
        />
      </div>
    </motion.div>
  );
}