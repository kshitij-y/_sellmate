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
import { useUserProfile } from "@/lib/hooks/useProfile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Address from "@/lib/types/User";

export default function AddressEditor() {
    const { user, loading, error, updateProfile } = useUserProfile();
    const [open, setOpen] = useState(false);

    const [addressForm, setAddressForm] = useState({
        line1: user?.address?.line1 || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        pincode: user?.address?.pincode || "",
    });

    const [phone, setPhone] = useState(user?.phone || "");

    // Sync form state when user.address or phone changes
    useEffect(() => {
        if (user?.address) {
            setAddressForm({
                line1: user.address.line1 || "",
                city: user.address.city || "",
                state: user.address.state || "",
                pincode: user.address.pincode || "",
            });
        }
        if (user?.phone) setPhone(user.phone);
    }, [user?.address, user?.phone]);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "phone") {
            setPhone(value);
        } else {
            setAddressForm((prev) => ({ ...prev, [id]: value }));
        }
    };

    const handleSave = async () => {
        // if (!user?.id) {
        //     toast.error("User ID not found");
        //     return;
        // }

        try {
            await updateProfile({ address: addressForm as Address, phone });
            setOpen(false);
            toast.success("Address updated successfully");
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
                        {user?.address ? "Edit Address" : "Add Address"}
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {user?.address ? "Edit Address" : "Add Address"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4">
                        {["line1", "city", "state", "pincode", "phone"].map(
                            (field) => (
                                <div key={field}>
                                    <Label htmlFor={field}>
                                        {field.replace("_", " ").toUpperCase()}
                                    </Label>
                                    <Input
                                        id={field}
                                        value={
                                            field === "phone"
                                                ? phone
                                                : addressForm[
                                                      field as keyof typeof addressForm
                                                  ]
                                        }
                                        onChange={handleAddressChange}
                                    />
                                </div>
                            )
                        )}
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSave} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : user?.address ? (
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
