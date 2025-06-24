import Guest from "@/components/Guest";
import AddTransaction from "@/components/AddTransaction";
import { currentUser } from "@clerk/nextjs/server";
import Balance from "@/components/Balance";
import IncomeExpense from "@/components/IncomeExpense";

export default async function HomePage() {
  const user = await currentUser();

  if (!user) {
    return <Guest />;
  }

  return (
    <main>
      <h2>Welcome, {user.firstName}</h2>
      <Balance />
      <IncomeExpense />
      <AddTransaction />
    </main>
  );
}
