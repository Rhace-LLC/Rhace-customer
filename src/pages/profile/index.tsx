import { useState } from "react";
import { User, Mail, Phone, MapPin, Edit, LogOut, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const auth = useAuth();
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
  });

  const [editedInfo, setEditedInfo] = useState(userInfo);

  const handleSave = () => {
    setUserInfo(editedInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo(userInfo);
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      // Mock logout functionality
      auth.logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="space-y-6 p-5">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-xl text-white">
                  {userInfo.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-medium">{userInfo.name}</h2>
                <p className="text-muted-foreground">{userInfo.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-primary hover:bg-primary/90 flex-1"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editedInfo.name}
                  onChange={(e) =>
                    setEditedInfo((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="mt-1"
                />
              ) : (
                <div className="mt-1 flex items-center gap-2 rounded-lg bg-gray-50 p-2">
                  <User className="text-muted-foreground h-4 w-4" />
                  <span>{userInfo.name}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editedInfo.email}
                  onChange={(e) =>
                    setEditedInfo((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              ) : (
                <div className="mt-1 flex items-center gap-2 rounded-lg bg-gray-50 p-2">
                  <Mail className="text-muted-foreground h-4 w-4" />
                  <span>{userInfo.email}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={editedInfo.phone}
                  onChange={(e) =>
                    setEditedInfo((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              ) : (
                <div className="mt-1 flex items-center gap-2 rounded-lg bg-gray-50 p-2">
                  <Phone className="text-muted-foreground h-4 w-4" />
                  <span>{userInfo.phone}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={editedInfo.address}
                  onChange={(e) =>
                    setEditedInfo((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              ) : (
                <div className="mt-1 flex items-center gap-2 rounded-lg bg-gray-50 p-2">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span>{userInfo.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-primary text-2xl font-bold">24</p>
                <p className="text-muted-foreground text-sm">Total Orders</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-primary text-2xl font-bold">8</p>
                <p className="text-muted-foreground text-sm">Reservations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="pt-6">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
