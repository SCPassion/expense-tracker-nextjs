"use client";
import { toast } from "react-toastify";
import { addTransaction } from "@/actions/addTransaction";

export default function AddTransaction() {
  async function clientAction(formData: FormData) {
    const { data, error } = await addTransaction(formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Transaction added");
      console.log("Transaction data:", data);
    }
  }

  return (
    <>
      <h3>Add transaction</h3>
      <form action={clientAction}>
        <div className="form-control">
          <label htmlFor="text">Text</label>
          <input
            type="text"
            name="text"
            id="text"
            required
            placeholder="Enter text..."
          />
        </div>

        <div className="form-control">
          <label htmlFor="amount">
            Amount <br /> (negative - expense, positive - income)
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            step="0.01"
            placeholder="Enter amount..."
            required
          />
        </div>
        <button type="submit" className="btn">
          Add transaction
        </button>
      </form>
    </>
  );
}
