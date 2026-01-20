import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDiningGroup } from "./diningGroup";
import { Plus, Loader2, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

export const DiningGroupView = () => {
  const {
    userGroup,
    isGroupDining,
    groups,
    loading,
    error,
    createGroup,
    showDiningGroups,
    joinGroup,
    joinLoading,
    userCurrentGroupError,
    userCurrentGroupLoading,
    fetchUserCurrentGroup,
    creating,
  } = useDiningGroup();

  if (!isGroupDining || !!userGroup) return null;

  return (
    <Dialog open={showDiningGroups}>
      <DialogContent
        className="max-w-[90vw] overflow-hidden rounded-[2.5rem] border-none p-0 shadow-2xl sm:max-w-[420px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="bg-white p-8 sm:p-10">
          <DialogHeader className="mb-8 space-y-3 text-left">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-blue-500 uppercase">
              Active Session
            </p>
            <DialogTitle className="text-2xl font-semibold tracking-tighter text-gray-900">
              Dining Groups
            </DialogTitle>
          </DialogHeader>

          {/* STATES: LOADING / ERROR */}
          {loading && (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
              <p className="text-[11px] font-medium tracking-widest text-gray-400 uppercase">
                Searching for groups...
              </p>
            </div>
          )}

          {userCurrentGroupLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
              <p className="text-[11px] font-medium tracking-widest text-gray-400 uppercase">
                Checking your group status...
              </p>
            </div>
          )}

          {userCurrentGroupError && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 text-center">
              <p className="text-xs font-medium text-red-600">
                {userCurrentGroupError}
              </p>
              <button
                onClick={fetchUserCurrentGroup}
                className="hover:bg-red mt-5 inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-red-900 px-8 text-[10px] font-semibold tracking-[0.2em] text-white uppercase shadow-sm transition-all active:scale-95"
              >
                <RotateCw size={12} className="text-white/70" />
                Retry Connection
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 text-center">
              <p className="text-xs font-medium text-red-600">{error}</p>
            </div>
          )}

          {/* CONTENT */}
          {!loading && !error && (
            <div className="space-y-6">
              {groups.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
                  <p className="text-[13px] leading-relaxed text-gray-400">
                    No active groups found at this table. Start a new session to
                    dine with others.
                  </p>
                </div>
              ) : (
                <div className="custom-scrollbar max-h-[50vh] space-y-4 overflow-y-auto pr-2">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className="group relative space-y-6 rounded-[2rem] border border-gray-100 bg-white p-6 transition-all hover:border-gray-200 hover:shadow-sm"
                    >
                      {/* HEADER: STATUS & TIME */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-2 w-2">
                            <span
                              className={cn(
                                "relative inline-flex h-2 w-2 rounded-full",
                                group.active ? "bg-emerald-500" : "bg-gray-300"
                              )}
                            ></span>
                          </div>
                          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                            {group.active ? "Active Now" : "Inactive"}
                          </p>
                        </div>
                        <p className="text-[11px] font-medium text-gray-300 italic">
                          {new Date(group.created).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* ACCESS CODE SECTION */}
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold tracking-widest text-gray-300 uppercase">
                          Access Code
                        </p>
                        <p className="text-2xl font-semibold tracking-[0.15em] text-gray-900">
                          {group.access_code}
                        </p>
                      </div>

                      {/* CUSTOMER LIST: MINIMALIST STYLE */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-semibold tracking-widest text-gray-300 uppercase">
                            Current Members
                          </p>
                          <span className="text-[10px] font-semibold text-gray-400">
                            {group.customers.length} total
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {group.customers.map((customer) => (
                            <div
                              key={customer.id}
                              className="flex items-center gap-2 rounded-full border border-gray-50 bg-gray-50/50 py-1 pr-3 pl-1 transition-colors hover:bg-gray-100"
                            >
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[9px] font-semibold text-gray-600 shadow-sm ring-1 ring-gray-100 ring-inset">
                                {customer.first_name[0]}
                                {customer.last_name[0]}
                              </div>
                              <span className="text-[11px] font-medium tracking-tight text-gray-700">
                                {customer.first_name} {customer.last_name}
                              </span>
                            </div>
                          ))}

                          {group.customers.length === 0 && (
                            <p className="text-[11px] text-gray-300 italic">
                              Waiting for members...
                            </p>
                          )}
                        </div>
                      </div>

                      {/* JOIN ACTION */}
                      <Button
                        onClick={() => joinGroup(group)}
                        disabled={joinLoading}
                        className="h-12 w-full rounded-xl bg-gray-900 text-[10px] font-semibold tracking-[0.2em] text-white uppercase transition-all hover:bg-black active:scale-[0.98]"
                      >
                        {joinLoading ? "Connecting..." : "Join Group"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-50 pt-4">
                <Button
                  className="h-14 w-full rounded-2xl bg-black text-[11px] font-semibold tracking-[0.2em] text-white uppercase shadow-xl shadow-black/10 transition-all hover:bg-gray-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                  onClick={createGroup}
                  disabled={loading || creating}
                >
                  {creating ? (
                    <>
                      <Loader2
                        size={14}
                        className="mr-2 animate-spin text-white/70"
                      />
                      Initiating Group...
                    </>
                  ) : (
                    <>
                      <Plus size={14} className="mr-2" />
                      Create New Group
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
