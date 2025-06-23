"use server";

import { text } from "stream/consumers";

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

  const transactionData: TransactionData = {
    text,
    amount,
  };

  return { data: transactionData };
}
