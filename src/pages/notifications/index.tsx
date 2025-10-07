import { useState } from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  CreditCard,
  Calendar,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      title: "Order Ready!",
      message: "Your order #ORD-002 is ready for pickup",
      time: "5 mins ago",
      isRead: false,
      icon: CheckCircle,
      iconColor: "text-green-500",
    },
    {
      id: 2,
      type: "reservation",
      title: "Reservation Confirmed",
      message:
        "Your table reservation for Dec 31 at 7:30 PM has been confirmed",
      time: "2 hours ago",
      isRead: false,
      icon: Calendar,
      iconColor: "text-blue-500",
    },
    {
      id: 3,
      type: "payment",
      title: "Payment Received",
      message: "Payment of $35.50 has been processed successfully",
      time: "3 hours ago",
      isRead: true,
      icon: CreditCard,
      iconColor: "text-green-500",
    },
    {
      id: 4,
      type: "order",
      title: "Order in Progress",
      message: "Your order #ORD-001 is being prepared. Estimated time: 15 mins",
      time: "1 day ago",
      isRead: true,
      icon: Clock,
      iconColor: "text-orange-500",
    },
    {
      id: 5,
      type: "general",
      title: "New Menu Items",
      message: "Check out our new seasonal dishes now available!",
      time: "2 days ago",
      isRead: true,
      icon: Bell,
      iconColor: "text-primary",
    },
  ]);

  const handleDelete = (notificationId: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const markAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-5">
        {/* Header */}
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-medium">Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-muted-foreground text-sm">
              You have {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    !notification.isRead
                      ? "border-primary/20 bg-primary/5"
                      : "hover:shadow-md"
                  }`}
                  onClick={() =>
                    !notification.isRead && markAsRead(notification.id)
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Icon
                        className={`mt-0.5 h-5 w-5 ${notification.iconColor}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <h4
                            className={`font-medium ${!notification.isRead ? "text-primary" : ""}`}
                          >
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <div className="bg-primary h-2 w-2 rounded-full" />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notification.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-2 text-sm">
                          {notification.message}
                        </p>
                        <span className="text-muted-foreground text-xs">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-2 font-medium">No notifications</h3>
                <p className="text-muted-foreground text-sm">
                  You're all caught up! New notifications will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
