"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
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
import { useProfile } from "@/lib/hooks/useProfile";

export default function ProfileEditor() {
  const { user, updateUserProfile } = useProfile();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    if (user) {
      setUserForm({
        name: user?.name || "",
        image: user?.image || "",
      });
    }
  }, [user]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUserProfile(userForm);
      setOpen(false); // Close dialog after successful update
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Edit Profile Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" onClick={() => setOpen(true)}>
            Edit Profile
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={userForm.name}
                onChange={handleUserChange}
              />
            </div>
            <div>
              <Label htmlFor="image">Profile Image URL</Label>
              <Input
                id="image"
                value={userForm.image}
                onChange={handleUserChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
