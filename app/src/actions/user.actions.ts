"use server"

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const syncClerkUserToDB = async () => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  const exisitingUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });
  if (!exisitingUser) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
      },
    });
  }
};
