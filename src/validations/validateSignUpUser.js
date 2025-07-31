import validator from "validator";

export const validateSignUpUser = async (req) => {
  const { email, password, role, name } = req.body;

  try {
    if (!name || !email || !password || !role) {
      throw new Error("All fields are required.");
    }
    if (!validator.isAlpha(name) || validator.isEmpty(name)) {
      throw new Error("Name is not.");
    }
    if (!validator.isEmail(email) || validator.isEmpty(email)) {
      throw new Error("Email is not valid.");
    }
  } catch (error) {}
};

export const validateSignInData = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Sign value not enough please give all credentials.");
  }
};
