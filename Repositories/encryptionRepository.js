import prisma from "../prisma/prisma.js";

export async function getEncryptedData(db, id) {
  const dbName = db.charAt(0).toUpperCase() + db.slice(1);
  const encryptedData = await prisma[dbName].findUnique({
    where: { userId: parseInt(id) },
    select: {
      [db + "Encrypted"]: true,
    },
  });
  return encryptedData;
}
