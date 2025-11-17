import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { TransactionDetailSheet } from "@/components/sheets/TransactionDetailSheet";

export function PaymentsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction);
  };

  const transactions = [
    {
      id: "TXN-001",
      orderId: "ORD-001",
      amount: 35.5,
      date: "Dec 30, 2024",
      time: "2:30 PM",
      method: "Visa ****4242",
      status: "completed",
      items: ["Truffle Pasta", "Caesar Salad"],
    },
    {
      id: "TXN-002",
      orderId: "ORD-002",
      amount: 38.25,
      date: "Dec 30, 2024",
      time: "2:15 PM",
      method: "Apple Pay",
      status: "completed",
      items: ["Grilled Salmon", "Garlic Bread"],
    },
    {
      id: "TXN-003",
      orderId: "ORD-003",
      amount: 52.0,
      date: "Dec 29, 2024",
      time: "7:30 PM",
      method: "Mastercard ****8888",
      status: "completed",
      items: ["Ribeye Steak", "Mashed Potatoes"],
    },
    {
      id: "TXN-004",
      orderId: "ORD-004",
      amount: 28.75,
      date: "Dec 27, 2024",
      time: "6:45 PM",
      method: "Visa ****4242",
      status: "completed",
      items: ["Margherita Pizza", "Tiramisu"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="space-y-5 p-4">
        <h2 className="mt-10 text-2xl font-medium">Transaction History</h2>

        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
              onClick={() => handleTransactionClick(transaction)}
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Order {transaction.orderId}</h4>
                  <p className="text-muted-foreground text-sm">
                    {transaction.date} at {transaction.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${transaction.amount}</p>
                  <Badge className="bg-green-100 text-xs text-green-800">
                    {transaction.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {transaction.method}
                </span>
                <div className="flex items-center gap-2">
                  <Eye className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground">View receipt</span>
                </div>
              </div>

              <div className="text-muted-foreground mt-2 text-sm">
                {transaction.items.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TransactionDetailSheet
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
