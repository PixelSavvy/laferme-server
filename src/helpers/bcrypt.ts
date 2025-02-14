import bcrypt from "bcryptjs";

const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = bcrypt.hash(password, salt);
    return hashed;
  } catch (error) {
    throw new Error(`Failed to hash password: ${error}`);
  }
};

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error(`Failed to compare password: ${error}`);
  }
};

export { comparePassword, hashPassword };
