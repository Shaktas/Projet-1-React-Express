import { getUserById } from "../Repositories/userRepository.js";
import encryption from "../Services/encryptionService.js";

export const getOneUser = async (req, res) => {
  const id = req.params.id;
  const dataDeciphered = "";
  try {
    const data = await getUserById(id);
    const dataDeciphered = await encryption.decrypt(data, id, "user");

    res.status(200).send({ success: true, data: dataDeciphered });
  } catch (error) {
    console.error("Error occurred during user retrieval:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};
