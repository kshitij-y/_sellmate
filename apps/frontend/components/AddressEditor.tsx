"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import useAddress from "@/lib/hooks/useAddress";
import { useProfile } from "@/lib/hooks/useProfile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AddressEditor() {
  const { user } = useProfile();
  const { address, loading, error, fetchAddress, addAddress, updateAddress } =
    useAddress();
  const [open, setOpen] = useState(false);

  const [addressForm, setAddressForm] = useState({
    address_line1: address?.address_line1 || "",
    address_line2: address?.address_line2 || "",
    city: address?.city || "",
    phone: address?.phone || "",
    pin_code: address?.pin_code || "",
    country: address?.country || "",
  });

  useEffect(() => {
    if (address) {
      setAddressForm({
        address_line1: address.address_line1 || "",
        address_line2: address.address_line2 || "",
        city: address.city || "",
        phone: address.phone || "",
        pin_code: address.pin_code || "",
        country: address.country || "",
      });
    }
  }, [address]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("User ID not found");
      return;
    }

    try {
      if (address?.id) {
        await updateAddress({ ...addressForm, address_id: address.id });
      } else {
        await addAddress(addressForm);
      }
      setOpen(false);
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error("Failed to save address");
    }
  };

  if (error) toast.error(error);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>
            {address ? "Edit Address" : "Add Address"}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {address ? "Edit Address" : "Add Address"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            {[
              "address_line1",
              "address_line2",
              "city",
              "phone",
              "pin_code",
              "country",
            ].map((field) => (
              <div key={field}>
                <Label htmlFor={field}>
                  {field.replace("_", " ").toUpperCase()}
                </Label>
                <Input
                  id={field}
                  value={addressForm[field as keyof typeof addressForm]}
                  onChange={handleAddressChange}
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : address ? (
                "Update Address"
              ) : (
                "Add Address"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
