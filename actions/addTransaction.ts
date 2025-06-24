"use server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache"; // Revalidate the current path after the action

type TransactionData = {
  text: string;
  amount: number;
};

type TransactionResult = {
  data?: TransactionData;
  error?: string;
};

export async function addTransaction(
  formData: FormData
): Promise<TransactionResult> {
  const textValue = formData.get("text");
  const amountValue = formData.get("amount");

  // check for input textValue
  if (!textValue || textValue === "" || !amountValue) {
    return { error: "Text or amount is missing" };
  }

  const text: string = textValue.toString();
  const amount: number = parseFloat(amountValue.toString());

  // Get logged-in user
  const { userId } = await auth();
  // Check for user
  if (!userId) {
    return { error: "User not founded" };
  }

  console.log("User ID:", userId);

  try {
    // Create a new transaction in the database
    const transactionData: TransactionData = await db.transaction.create({
      data: { text, amount, userId },
    });

    revalidatePath("/"); // Revalidate the home page to reflect the new transaction

    return { data: transactionData };
  } catch (error) {
    return { error: "Failed to add transaction" };
  }
}
