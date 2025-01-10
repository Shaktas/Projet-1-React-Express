import prisma from "../prisma/prisma.js";

export async function getEncryptedData(db, id) {
  const encryptedData = await prisma[db].findUnique({
    where: { [db + "Id"]: parseInt(id) },
    select: {
      [db + "Encrypted"]: true,
    },
  });
  return encryptedData;
}
