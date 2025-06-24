"use client";

import { Transaction } from "@/types/Transaction";
import { addCommas } from "@/lib/utils";
import { toast } from "react-toastify";
import { deleteTransaction } from "@/actions/deleteTransaction";

export default function TransactionItem({
  transaction,
}: {
  transaction: Transaction;
}) {
  async function handleDeleteTransaction(tranasactionId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmed) return;

    const { message, error } = await deleteTransaction(tranasactionId);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success(message);
  }

  const sign = transaction.amount < 0 ? "-" : "+";
  return (
    <li className={transaction.amount < 0 ? "minus" : "plus"}>
      {transaction.text}
      <span>
        {sign}
        {addCommas(Math.abs(transaction.amount))}
      </span>
      <button
        className="delete-btn"
        onClick={() => handleDeleteTransaction(transaction.id)}
      >
        x
      </button>
    </li>
  );
}
