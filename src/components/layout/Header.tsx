import { Menu, Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  // Kept fresh by LiveUpdates.
  const unread = useSelector((state: RootState) => state.notifications.unreadCount);

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
        className="bg-primary/10 relative cursor-pointer rounded-full p-3"
        size="icon"
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-md">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Button>
    </div>
  );
}
