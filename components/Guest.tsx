import { SignInButton } from "@clerk/nextjs";
export default function Guest() {
  return (
    <div className="guest">
      <h1>Welcome</h1>
      <p>Please sign in to manage your transactions</p>
      <SignInButton />
    </div>
  );
}
