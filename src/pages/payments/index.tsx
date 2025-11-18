"use client";

import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ContentHOC } from "@/components/nocontent";
import { TransactionDetailSheet } from "@/components/sheets/TransactionDetailSheet";
import { usePaymentData } from "./usePaymentData";

export function PaymentsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const dataStore = useSelector(
    (state: RootState) => state.paymentTransactions
  );
  const paginatedData = dataStore.data;
  const totalItems = dataStore.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const { fetchAllData, loading, error } = usePaymentData(page);

  const transactionsToShow = paginatedData[String(page)] ?? [];

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction);
  };

  useEffect(() => {
    if (!paginatedData[String(page)]) {
      fetchAllData();
    }
  }, [page, paginatedData, fetchAllData]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="space-y-5 p-4">
        <h2 className="mt-10 text-2xl font-medium">Transaction History</h2>

        <ContentHOC
          loading={loading}
          error={!!error}
          noContent={transactionsToShow.length === 0}
          loadingText="Fetching Transactions. Please Wait."
          noContentMessage="No transactions found"
          noContentBtnText="Reload Transactions"
          noContentAction={fetchAllData}
          errMessage={error || "Failed to load transactions."}
          actionFn={fetchAllData}
        >
          <div className="space-y-3">
            {transactionsToShow.map((txn) => (
              <div
                key={txn.id}
                className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                onClick={() => handleTransactionClick(txn)}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Order {`txn.orderId`}</h4>
                    <p className="text-muted-foreground text-sm">
                      {`txn.date`} at {`txn.time`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${txn.amount}</p>
                    <Badge className="bg-green-100 text-xs text-green-800">
                      {txn.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{`txn.method`}</span>
                  <div className="flex items-center gap-2">
                    <Eye className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground">View receipt</span>
                  </div>
                </div>

                <div className="text-muted-foreground mt-2 text-sm">
                  {`txn.items.join(", ")`}
                </div>
              </div>
            ))}
          </div>
        </ContentHOC>

        {/* Pagination (optional) */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`rounded border px-3 py-1 text-sm ${
                  page === i + 1
                    ? "bg-primary text-white"
                    : "border-gray-300 bg-white hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <TransactionDetailSheet
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
