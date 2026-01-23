import { useEffect, useState } from "react";
import { toast } from "sonner";
import { parseError } from "@/api-services/utils/parseError";
import {
  createDiningGroup,
  DiningGroup,
  getCurrentGroup,
  getDiningGroupsByTable,
  joinDiningGroup,
} from "@/api-services/dininggroup.service";
import { useAuth } from "./AuthContext";
import { useSetupContext } from "./SetupContext";

export const useDiningGroup = () => {
  const auth = useAuth();
  const setup = useSetupContext();
  const { preferredDiningExperience, shouldPrompt } = setup;

  const selectedRestaurant = setup.selectedRestaurant;

  const [groups, setGroups] = useState<DiningGroup[]>([]);
  const [userGroup, setUserGroup] = useState<DiningGroup | null>(null);
  const [showDiningGroups, setShowDiningGroups] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const isGroupDining = preferredDiningExperience === "group";

  //const [userCurrentGroup, setUserCurrentGroup] = useState<DiningGroup | null>(null);
  const [userCurrentGroupLoading, setUserCurrentGroupLoading] = useState(false);
  const [userCurrentGroupError, setUserCurrentGroupError] = useState<
    string | null
  >(null);

  const fetchUserCurrentGroup = async () => {
    if (!auth.token || !isGroupDining) return;

    setUserCurrentGroupLoading(true);
    setUserCurrentGroupError(null);

    try {
      const activeGroup = await getCurrentGroup(auth.token);
      if (activeGroup) {
        setUserGroup(activeGroup); // user is already in a group
        setShowDiningGroups(false); // close the dialog automatically
        toast.info("Your active dining group has been rejoined. Happy dining.");
      } else {
        setUserGroup(null); // no active group → user can join or create
        fetchGroups(); // fetch available groups to join
      }
    } catch (err) {
      const message = parseError(err);
      if (message == "No DiningGroup matches the given query.") {
        fetchGroups();
        return;
      }
      setUserCurrentGroupError(message);
      toast.error(message);
      throw err;
    } finally {
      setUserCurrentGroupLoading(false);
    }
  };

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
        { table: selectedRestaurant?.tableId || "" },
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

  // Auto-load groups or check current group when user selects "group" dining
  useEffect(() => {
    if (!isGroupDining) {
      setGroups([]);
      setUserGroup(null);
      setShowDiningGroups(false);
      return;
    }

    if (!userGroup) {
      // First, check if the user is already in a group
      fetchUserCurrentGroup();
      return;
    }

    // User has a group → close dialog
    if (userGroup) {
      setGroups([]);
      setShowDiningGroups(false);
      setError(null);
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
    fetchUserCurrentGroup,
    refreshGroups: fetchGroups,
    joinGroup,
    createGroup,
    isGroupDining,
    groups,
    loading,
    error,
    creating,
    userGroup,
    setUserGroup,
    showDiningGroups,
    setShowDiningGroups,
    joinError,
    joinLoading,
    userCurrentGroupError,
    userCurrentGroupLoading,
  };
};
