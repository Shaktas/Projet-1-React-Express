import { getUserById } from "../Repositories/userRepository.js";

export const getOneUser = async (req, res) => {
  const id = req.user.id;
  const data = await getUserById(id);
  return data;
};
