export async function getEncryptedData(db, id) {
  const encryptedData = await prisma[db].findUnique({
    where: { id: id },
    select: {
      [db + "Encrypted"]: true,
    },
  });
  return encryptedData;
}
