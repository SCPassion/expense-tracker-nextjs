"use server";
import db from "@/lib/db";
import { Transaction } from "@/types/Transaction";
import { auth } from "@clerk/nextjs/server";

export async function getIncomeExpense(): Promise<{
  income?: number;
  expense?: number;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "User not found" };
  }

  try {
    const transactions: Transaction[] = await db.transaction.findMany({
      where: { userId },
    });

    const amounts = transactions.map(
      (transaction: Transaction) => transaction.amount
    );
    const income = amounts
      .filter((amount) => amount > 0)
      .reduce((total, amount) => total + amount, 0);

    const expense = amounts
      .filter((amount) => amount < 0)
      .reduce((total, amount) => total + amount, 0);

    return { income, expense: Math.abs(expense) };
  } catch (error) {
    return { error: "Database error" };
  }
}
