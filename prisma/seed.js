import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      userPseudo: "Shaktas",
      userEmail: "shaktasTest@gmail.com",
      userPassword:
        "$2b$10$j2U75dIbRZQlEuwLbn6zyeZubz7qEf5AUUTPJzHUWza.eWlAu.vNW",
    },
  });

  const vault1 = await prisma.vault.create({
    data: {
      vaultName: "Shaktas's Personal Vault",
      userId: user1.userId,
    },
  });

  const card1 = await prisma.card.create({
    data: {
      cardTitle: "Shaktas Gmail",
      cardLogin: "shaktas@gmail.com",
      cardPassword: "securePass123",
      cardUrl: "https://gmail.com",
      vaultId: vault1.vaultId,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      userPseudo: "ShaktasFriend",
      userEmail: "shaktasfriend@example.com",
      userPassword: "hashedPassword456",
    },
  });

  await prisma.posseder.create({
    data: {
      vaultId: vault1.vaultId,
      userId: user2.userId,
    },
  });

  await prisma.card.create({
    data: {
      cardTitle: "Shaktas Facebook",
      cardLogin: "shaktas.fb",
      cardPassword: "fbPass123!",
      cardUrl: "https://facebook.com",
      vaultId: vault1.vaultId,
    },
  });

  await prisma.card.create({
    data: {
      cardTitle: "Shaktas Twitter",
      cardLogin: "shaktas_twitter",
      cardPassword: "tweetPass456!",
      cardUrl: "https://twitter.com",
      vaultId: vault1.vaultId,
    },
  });

  await prisma.card.create({
    data: {
      cardTitle: "Shaktas Amazon",
      cardLogin: "shaktas.shopping",
      cardPassword: "shopSecure789!",
      cardUrl: "https://amazon.com",
      vaultId: vault1.vaultId,
    },
  });

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
