import { getUserById } from "../Repositories/userRepository.js";

export const getOneUser = async (req, res) => {
  const data = await getUserById(req.params.id);
  return data;
};
