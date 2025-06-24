## How to Use Prisma with Neon Database and Clerk Authentication in Next.js

This guide explains how to set up and use Prisma with a Neon database and Clerk for authentication in a Next.js project, including code examples for authentication and CRUD operations.

---

### 1. Install Dependencies

```bash
npm install -D prisma
npm install @prisma/client @clerk/nextjs neon-client
```

---

### 2. Initialize Prisma and Configure Neon

1. **Initialize Prisma:**
   ```bash
   npx prisma init
   ```
2. **Edit `prisma/schema.prisma`:**
   Replace the `provider` and `url` with your Neon connection string:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   Set your Neon connection string in `.env`:
   ```env
   DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
   ```

---

### 3. Generate Prisma Client to a Custom Directory (Optional)

If you want Prisma Client in a custom path (e.g., `app/generated/prisma`):

In `schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"
}
```

Generate the client:

```bash
npx prisma generate
```

---

### 4. Exclude Generated Code from Linting/Type Checking

- In `eslint.config.js`:
  ```js
  // ...existing config...
  ignores: ["app/generated/prisma/**"],
  // ...existing config...
  ```
- In `tsconfig.json`:
  ```json
  "exclude": [
    "app/generated/prisma"
    // ...existing excludes...
  ]
  ```

---

### 5. Set Up Clerk Authentication

1. **Install Clerk:**
   ```bash
   npm install @clerk/nextjs
   ```
2. **Wrap your app with ClerkProvider** in `app/layout.tsx`:
   ```tsx
   import { ClerkProvider } from "@clerk/nextjs";
   // ...existing code...
   <ClerkProvider>{/* ...your app... */}</ClerkProvider>;
   // ...existing code...
   ```
3. **Protect pages/components:**

   ```tsx
   import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

   export default function Page() {
     return (
       <>
         <SignedIn>{/* Authenticated content */}</SignedIn>
         <SignedOut>
           <SignInButton />
         </SignedOut>
       </>
     );
   }
   ```

---

### 6. Use Prisma Client in Your App

**Import Prisma Client from the custom path:**

```ts
// lib/db.ts
import { PrismaClient } from "../app/generated/prisma";
export const prisma = new PrismaClient();
```

---

### 7. CRUD Example with Clerk Auth

**Example: Create, Read, Update, Delete Transaction**

```ts
// actions/addTransaction.ts
import { prisma } from "../lib/db";
import { auth } from "@clerk/nextjs";

export async function addTransaction(data: {
  amount: number;
  description: string;
}) {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");
  return prisma.transaction.create({
    data: {
      userId,
      amount: data.amount,
      description: data.description,
    },
  });
}
```

**Read Transactions:**

```ts
// actions/getTransactions.ts
import { prisma } from "../lib/db";
import { auth } from "@clerk/nextjs";

export async function getTransactions() {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");
  return prisma.transaction.findMany({ where: { userId } });
}
```

**Update Transaction:**

```ts
// actions/updateTransaction.ts
import { prisma } from "../lib/db";
import { auth } from "@clerk/nextjs";

export async function updateTransaction(
  id: string,
  data: { amount?: number; description?: string }
) {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");
  return prisma.transaction.update({
    where: { id, userId },
    data,
  });
}
```

**Delete Transaction:**

```ts
// actions/deleteTransaction.ts
import { prisma } from "../lib/db";
import { auth } from "@clerk/nextjs";

export async function deleteTransaction(id: string) {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");
  return prisma.transaction.delete({ where: { id, userId } });
}
```

---

### 8. Deploying to Vercel

- Ensure your Neon connection string and Clerk keys are set in Vercel project environment variables.
- Vercel will run `prisma generate` and build your app automatically.
- If using a custom Prisma Client output, ensure your import paths are correct and generated code is excluded from linting/type checking as above.

---

### 9. Troubleshooting

- **Prisma Client not found:** Ensure you run `npx prisma generate` after every schema change.
- **ESLint/TypeScript errors on generated code:** Make sure `app/generated/prisma` is excluded in both `eslint.config.js` and `tsconfig.json`.
- **Auth errors:** Make sure Clerk is properly configured and your components are wrapped with `ClerkProvider`.

---

For more, see the official docs:

- [Prisma Docs](https://www.prisma.io/docs)
- [Neon Docs](https://neon.tech/docs)
- [Clerk Docs](https://clerk.com/docs)

### install prisma

```
npm install -D prisma
```

### Initialize a database schema

```
npx prisma init
```

### Modify the database schema

```
npx prisma migrate dev --name init
npx prisma generate
```

### install clerk

```
npm install @clerk/nextjs
```

### Follow tutorial here:

https://dashboard.clerk.com/apps/app_2yv2c4MJKgmR8BAWDwXemY2pO04/instances/ins_2yv2c80q4gD2cJW2E1wh6CLapjh
