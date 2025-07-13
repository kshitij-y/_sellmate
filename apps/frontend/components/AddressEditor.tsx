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
  const { addresses , loading, error, addAddress, updateAddress } =
    useAddress();
  const [open, setOpen] = useState(false);

  const [addressForm, setAddressForm] = useState({
    address_line1: addresses[0]?.address_line1 || "",
    address_line2: addresses[0]?.address_line2 || "",
    city: addresses[0]?.city || "",
    phone: addresses[0]?.phone || "",
    pin_code: addresses[0]?.pin_code || "",
    country: addresses[0]?.country || "",
  });

  useEffect(() => {
    if (addresses[0]) {
      setAddressForm({
        address_line1: addresses[0].address_line1 || "",
        address_line2: addresses[0].address_line2 || "",
        city: addresses[0].city || "",
        phone: addresses[0].phone || "",
        pin_code: addresses[0].pin_code || "",
        country: addresses[0].country || "",
      });
    }
  }, [addresses]);

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
      if (addresses[0]?.id) {
        await updateAddress({ ...addressForm, id: addresses[0].id });
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
            {addresses ? "Edit Address" : "Add Address"}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {addresses ? "Edit Address" : "Add Address"}
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
              ) : addresses ? (
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
