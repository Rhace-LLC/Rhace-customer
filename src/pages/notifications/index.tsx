import { useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotificationData } from "./useNotificationData";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { ContentHOC } from "@/components/nocontent";
import { Pagination } from "@/components/pagination";
import { markAsRead, removeNotification, setUnreadCount } from "@/store/notification.slice";
import { deleteNotification, markNotificationsRead } from "@/api-services/notification.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function NotificationsPage() {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const page_size = 8;

  const dataStore = useSelector((state: RootState) => state.notifications);
  const allData = dataStore.data;
  const unreadTotal = dataStore.unreadCount;
  const { token } = useAuth();

  // Hook for fetching notifications
  const {
    fetchAllData,
    loading: fetchLoading,
    error: fetchError,
  } = useNotificationData(page, page_size);

  // Get notifications for current page
  const notifications = allData[String(page)] ?? [];

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Optimistic: update the list now, then tell the server so it sticks
  // after a refresh (and the bell badge drops).
  const handleDelete = (notificationId: number) => {
    const target = notifications.find((n) => n.id === notificationId);
    dispatch(removeNotification(notificationId));
    if (target && !target.is_read) dispatch(setUnreadCount(unreadTotal - 1));
    deleteNotification(notificationId, token).catch(() =>
      toast.error("Couldn't delete that notification. It may come back on refresh.")
    );
  };

  const handleMarkAsRead = (notificationId: number) => {
    dispatch(markAsRead(notificationId));
    dispatch(setUnreadCount(unreadTotal - 1));
    markNotificationsRead({ notification_ids: [notificationId] }, token).catch(() => {
      /* stays unread on the server; the next poll restores the true count */
    });
  };

  // Fetch data if not available for current page
  useEffect(() => {
    if (!allData[String(page)]) {
      fetchAllData();
    }
  }, [page, allData, fetchAllData]);

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

        <ContentHOC
          loading={fetchLoading}
          error={!!fetchError}
          noContent={notifications.length === 0}
          loadingText="Fetching notifications..."
          noContentBtnText="Refresh"
          noContentMessage="No notifications found"
          noContentAction={fetchAllData}
          errMessage={fetchError}
          actionFn={fetchAllData}
        >
          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = Bell; // fallback
              return (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    !notification.is_read
                      ? "border-primary/20 bg-primary/5"
                      : "hover:shadow-md"
                  }`}
                  onClick={() =>
                    !notification.is_read && handleMarkAsRead(notification.id)
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Icon className={`mt-0.5 h-5 w-5 ${"text-primary"}`} />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <h4
                            className={`font-medium ${
                              !notification.is_read ? "text-primary" : ""
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            {!notification.is_read && (
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
                          {notification.time_ago}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ContentHOC>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={page + 1}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}
