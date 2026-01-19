import { useEffect, useState } from "react";
import { toast } from "sonner";
import { parseError } from "@/api-services/utils/parseError";
import {
  createDiningGroup,
  DiningGroup,
  getDiningGroupsByTable,
  joinDiningGroup,
} from "@/api-services/dininggroup.service";
import { useSelectedRestaurant } from "@/store/useSelectedRestaurant";
import { useDiningExperience } from "./DiningExperienceContext";
import { useAuth } from "./AuthContext";

export const useDiningGroup = () => {
  const auth = useAuth();
  const { preferredDiningExperience, shouldPrompt } = useDiningExperience();

  const selectedRestaurant = useSelectedRestaurant();

  const [groups, setGroups] = useState<DiningGroup[]>([]);
  const [userGroup, setUserGroup] = useState<DiningGroup | null>(null);

  const [showDiningGroups, setShowDiningGroups] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const isGroupDining = preferredDiningExperience === "group";

  const fetchGroups = async () => {
    if (!auth.token || !isGroupDining) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getDiningGroupsByTable(
        selectedRestaurant?.tableId || "",
        auth.token
      );
      setGroups(response || []);
    } catch (err) {
      const message = parseError(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async () => {
    if (!auth.token || !isGroupDining) return;
    setCreating(true);
    try {
      const response = await createDiningGroup(
        { table: selectedRestaurant.tableId || "" },
        auth.token
      );
      setUserGroup(response);
      await fetchGroups(); // refresh list after creation
    } catch (err) {
      const message = parseError(err);
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const joinGroup = async (group: DiningGroup) => {
    const { id: group_id, access_code } = group;
    setJoinLoading(true);
    setJoinError(null);

    try {
      const response = await joinDiningGroup(
        { group_id, access_code },
        auth.token
      );
      setUserGroup(group);

      toast.success(response.message || "Joined group successfully!");
      return response;
    } catch (err) {
      const message = parseError(err);
      setJoinError(message);
      toast.error(message);
      return null;
    } finally {
      setJoinLoading(false);
    }
  };

  useEffect(() => {
    // User is in group dining mode but not in any group yet
    if (isGroupDining && !userGroup) {
      fetchGroups();
      return;
    }

    // User has joined or created a group → close dialog & cleanup
    if (userGroup) {
      setGroups([]);
      setError(null);
      setShowDiningGroups(false); // 🔑 close DiningGroupView dialog
      return;
    }

    // User switched away from group dining
    if (!isGroupDining) {
      setGroups([]);
      setUserGroup(null);
      setError(null);
      setShowDiningGroups(false);
    }
  }, [isGroupDining, userGroup]);

  useEffect(() => {
    if (
      !shouldPrompt &&
      preferredDiningExperience &&
      preferredDiningExperience == "group"
    ) {
      setShowDiningGroups(true);
    } else {
      setShowDiningGroups(false);
    }
  }, [shouldPrompt, preferredDiningExperience]);

  return {
    isGroupDining,
    groups,
    loading,
    error,
    creating,
    refreshGroups: fetchGroups,
    createGroup,
    userGroup,
    setUserGroup,
    showDiningGroups,
    setShowDiningGroups,
    joinError,
    joinLoading,
    joinGroup,
  };
};
