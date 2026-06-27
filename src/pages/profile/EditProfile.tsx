import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  updateProfile as apiUpdateProfile,
  UserProfile,
} from "@/api-services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setProfile } from "@/store/userSlice";

interface EditProfileProps {
  profile: UserProfile;
  onEdit: (val: boolean) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ profile, onEdit }) => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: profile.first_name,
    last_name: profile.last_name,
    phone: profile.phone,
    restaurant: profile.restaurant || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const response = await apiUpdateProfile(auth.token, form);
      dispatch(setProfile(response.data));

      toast.success("Profile updated successfully");
      onEdit(false);
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full rounded-2xl shadow-sm">
      <CardContent className="space-y-6 p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Edit Profile
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first_name"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              First Name
            </label>

            <Input
              id="first_name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Last Name
            </label>

            <Input
              id="last_name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Phone
            </label>

            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full sm:w-32"
          >
            {loading ? "Saving..." : "Save"}
          </Button>

          <Button
            onClick={() => onEdit(false)}
            disabled={loading}
            className="w-full sm:w-32"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditProfile;