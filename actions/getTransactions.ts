"use server";
import db from "@/lib/db";
import { Transaction } from "@/types/Transaction";
import { auth } from "@clerk/nextjs/server";

export async function getTransactions(): Promise<{
  transactions?: Transaction[];
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "User not found" };
  }

  try {
    const transactions = await db.transaction.findMany({
      where: { userId }, // Filter by user ID
      orderBy: { createdAt: "desc" }, // Order by most recent
    });

    return { transactions };
  } catch (error) {
    return { error: "Database error" };
  }
}
