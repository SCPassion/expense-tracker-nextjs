import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function checkUser() {
  const user = await currentUser();

  // Check for current logged in clerk user
  if (!user) {
    return null;
  }

  // Check if user is already in the prisma neon database
  const loggedInUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
  });

  // If user is in database, return user
  if (loggedInUser) {
    return loggedInUser;
  }

  // If not in database, create a new user
  const newUser = await db.user.create({
    data: {
      clerkUserId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress,
    },
  });

  return newUser;
}
