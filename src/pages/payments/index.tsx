"use client";

import { Eye } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
// Assuming these imports exist and are available
import { Badge } from "@/components/ui/badge";
import { RootState } from "@/store/store";
import { ContentHOC } from "@/components/nocontent";
import { TransactionDetailSheet } from "@/components/sheets/TransactionDetailSheet";
import { usePaymentData } from "./usePaymentData";

// Re-defining Payment interface for context, assuming it's available globally or imported
export interface Payment {
  id: string;
  reference: string;
  order_id: number;
  amount: number;
  currency: string;
  status: "processing" | "failed" | "success";
  payment_method: string | null;
  customer_email: string;
  created_at: string;
  paid_at: string | null;
  fees: number;
  order_type: "dine-in" | string;
}

// Helper function to determine badge styling based on status
const getStatusBadgeColor = (status: Payment["status"]) => {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-800 border-green-300";
    case "failed":
      return "bg-red-100 text-red-800 border-red-300";
    case "processing":
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
  }
};

export function PaymentsPage() {
  // Correctly typing selectedTransaction
  const [selectedTransaction, setSelectedTransaction] =
    useState<Payment | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Assuming RootState and Redux logic works as intended
  const dataStore = useSelector(
    (state: RootState) => state.paymentTransactions
  );
  const paginatedData = dataStore.data;
  const totalItems = dataStore.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Assuming usePaymentData hook works as intended
  const { fetchAllData, loading, error } = usePaymentData(page);

  const transactionsToShow: Payment[] = useMemo(() => {
    return paginatedData[String(page)] ?? [];
  }, [paginatedData, page]);

  const handleTransactionClick = (transaction: Payment) => {
    setSelectedTransaction(transaction);
  };

  useEffect(() => {
    if (!paginatedData[String(page)]) {
      fetchAllData();
    }
  }, [page, paginatedData, fetchAllData]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-6xl space-y-5 p-4 sm:p-6 md:p-8">
        <h2 className="mt-4 text-xl font-semibold text-gray-900 sm:mt-8">
          Transaction History
        </h2>

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
          <div className="space-y-4">
            {/* Iterating over the correctly typed array */}
            {transactionsToShow.map((txn: Payment) => {
              const formattedDate = new Date(
                txn.created_at
              ).toLocaleDateString();
              const formattedTime = new Date(txn.created_at).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              );
              const amountDisplay = `${txn.currency} ${txn.amount.toFixed(2)}`;
              const statusClass = getStatusBadgeColor(txn.status);
              const methodDisplay = txn.payment_method || txn.order_type;

              return (
                <div
                  key={txn.id}
                  className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:border-blue-300 hover:shadow-lg"
                  onClick={() => handleTransactionClick(txn)}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      {/* Correctly using order_id */}
                      <h4 className="text-lg font-semibold text-gray-800">
                        Order #{txn.order_id}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {/* Correctly formatting created_at */}
                        {formattedDate} at {formattedTime}
                      </p>
                    </div>
                    <div className="text-right">
                      {/* Correctly using amount and currency */}
                      <p className="text-xl font-bold text-gray-900">
                        {amountDisplay}
                      </p>
                      {/* Correctly using status and color helper */}
                      <Badge
                        variant="outline"
                        className={`mt-1 text-xs font-semibold uppercase ${statusClass}`}
                      >
                        {txn.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
                    {/* Using payment method or order type as a fallback */}
                    <span className="font-medium text-gray-600 capitalize">
                      {methodDisplay}
                    </span>
                    <div className="flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700">
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">Details</span>
                    </div>
                  </div>

                  {/* Using reference as a unique identifier */}
                  <p className="mt-2 truncate text-xs text-gray-400">
                    Ref: {txn.reference}
                  </p>
                </div>
              );
            })}
          </div>
        </ContentHOC>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  page === i + 1
                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      {selectedTransaction && (
        <TransactionDetailSheet
          // Transaction is correctly typed now
          transaction={selectedTransaction}
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}
