import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = "123";

  const users = [
    {
      UserPseudo: "JohnDoe",
      UserEmail: "john.doe@example.com",
      UserPassword: hashedPassword,
    },
    {
      UserPseudo: "JaneSmith",
      UserEmail: "jane.smith@example.com",
      UserPassword: hashedPassword,
    },
    {
      UserPseudo: "BobWilson",
      UserEmail: "bob.wilson@example.com",
      UserPassword: hashedPassword,
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

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
