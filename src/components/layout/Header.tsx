import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="border-border fixed top-0 z-10 flex w-full items-center justify-between border-b bg-white p-4">
      {/* Menu button */}
      <Button variant="ghost" size="icon" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Title */}
      <h1 className="text-lg font-medium">{title}</h1>

      {/* Notification bell on the right */}
      <Button
        onClick={() => {
          navigate("/notifications");
        }}
        variant="ghost"
        className="bg-primary/10 cursor-pointer rounded-full p-3"
        size="icon"
      >
        <Bell className="h-5 w-5" />
      </Button>
    </div>
  );
}
