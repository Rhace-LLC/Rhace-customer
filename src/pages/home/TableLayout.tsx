import { useState } from "react";
import {
  Users,
  Armchair,
  RefreshCw,
  X,
  Info,
  CheckCircle2,
  Clock,
  Ban,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getTables } from "@/api-services/menu.service";
import { parseError } from "@/api-services/utils/parseError";
import { useSetupContext } from "@/contexts/SetupContext";

interface CustomerTableLayoutViewProps {
  buttonLabel?: string;
  page?: number;
  page_size?: number;
}

export function CustomerTableLayoutView({
  buttonLabel = "Restaurant Table Layout",
  page = 1,
  page_size = 50,
}: CustomerTableLayoutViewProps) {
  const auth = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<any[]>([]);

  const setup = useSetupContext();

  const restaurantId = setup.selectedRestaurant?.restaurantId || "";

  const fetchLayout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getTables(
        restaurantId,
        { page, page_size },
        auth.token
      );

      const fetchedTables = res;
      setTables(fetchedTables);

      toast.success("Floor layout loaded successfully");
    } catch (err: any) {
      const parsedErr = parseError(err) || "Failed to fetch table data.";
      setError(parsedErr);
      toast.error(parsedErr);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
    fetchLayout();
  };

  const getStatusStyle = (statusRaw: string) => {
    const status = (statusRaw || "").toLowerCase();

    if (status === "available" || status === "vacant" || status === "free") {
      return {
        cardBg: "border-emerald-100 bg-white hover:border-emerald-300",
        badgeBg: "bg-emerald-100 text-emerald-700",
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        label: "Available",
      };
    }

    if (status === "occupied" || status === "busy") {
      return {
        cardBg: "border-rose-100 bg-white hover:border-rose-300",
        badgeBg: "bg-rose-100 text-rose-700",
        icon: <Ban className="w-3.5 h-3.5 text-rose-600" />,
        label: "Occupied",
      };
    }

    if (status === "reserved" || status === "booked") {
      return {
        cardBg: "border-amber-100 bg-white hover:border-amber-300",
        badgeBg: "bg-amber-100 text-amber-700",
        icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
        label: "Reserved",
      };
    }

    return {
      cardBg: "border-gray-200 bg-white hover:border-gray-400",
      badgeBg: "bg-gray-100 text-gray-600",
      icon: <Info className="w-3.5 h-3.5 text-gray-500" />,
      label: statusRaw || "Unknown",
    };
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="flex h-16 items-center justify-between rounded-3xl bg-black px-8 text-[15px] font-bold tracking-tight text-white shadow-2xl shadow-black/20 transition-all hover:bg-gray-800 active:scale-[0.98]"
      >
        <span>{buttonLabel}</span>
        <Armchair className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative z-10 flex h-full max-h-[65vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[12px] font-bold tracking-[0.3em] text-blue-500 uppercase">
                    Floor Plan
                  </p>
                  <h2 className="text-xl font-bold tracking-tight text-gray-900">
                    Table Layout
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchLayout}
                  disabled={loading}
                  title="Refresh Layout"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/50 px-8 py-3">
              <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span>Reserved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span>Occupied</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {loading ? (
                <div className="flex h-64 flex-col items-center justify-center gap-4">
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-gray-100" />
                    <Loader2 className="h-8 w-8 animate-spin text-gray-900" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-[14px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
                      Loading
                    </p>
                    <p className="text-[16px] font-medium text-gray-900">
                      Fetching table layout...
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="animate-in zoom-in-95 mx-auto max-w-sm rounded-[2.5rem] border border-red-100 bg-red-50/30 p-10 text-center duration-300">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <AlertCircle className="text-red-500" size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[18px] font-semibold tracking-tight text-gray-900">
                    Connection Issue
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-gray-500">{error}</p>
                  <button
                    onClick={fetchLayout}
                    className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gray-900 text-[14px] font-semibold tracking-[0.15em] text-white uppercase transition-all hover:bg-black active:scale-95"
                  >
                    <RefreshCw size={16} />
                    Retry Connection
                  </button>
                </div>
              ) : tables.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center gap-2 text-gray-400">
                  <Info className="h-8 w-8" />
                  <p className="text-sm">No tables available to display.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {tables.map((table, idx) => {
                    const style = getStatusStyle(table.status || table.state);
                    const tableNum = table.table_number || table.number || table.tableNumber || idx + 1;

                    return (
                      <div
                        key={table.id || idx}
                        className={`group relative flex flex-col justify-between rounded-3xl border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${style.cardBg}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                              Table
                            </span>
                            <h3 className="text-xl font-extrabold tracking-[-0.03em] text-gray-900">
                              {tableNum}
                            </h3>
                          </div>
                          <div
                            className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${style.badgeBg}`}
                          >
                            {style.icon}
                            <span>{style.label}</span>
                          </div>
                        </div>


                        <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 text-xs text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            <span>Cap: {table.max_seat_capacity}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-8 py-3 text-xs text-gray-400">
              <span>Total Tables: {tables.length}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
