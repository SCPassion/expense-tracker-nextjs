"use server";
import db from "@/lib/db";
import { Transaction } from "@/types/Transaction";
import { auth } from "@clerk/nextjs/server";

export async function getUserBalance(): Promise<{
  balance?: number;
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

    const balance = transactions.reduce(
      (total, tranaction) => total + tranaction.amount,
      0
    );

    return { balance };
  } catch (error) {
    return { error: "Database error" };
  }
}
