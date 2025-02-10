import { userAxiosInstance } from "../../../../redux/constants/AxiosInstance";

export const validatePassword = (password) => {
  const validations = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

  return {
    isValid: Object.values(validations).every(Boolean),
    validations,
  };
};

const validateForm = async({ fullName, email, password, confirmPassword, referal }) => {
  const errors = {
    name: null,
    email: null,
    password: null,
    cPassword: null,
    userExist: null,
    all: true,
  };

  // Name validation
  if (!fullName.trim()) {
    errors.name = "Full name is required";
    errors.all = false;
  } else if (fullName.length < 2) {
    errors.name = "Name must be at least 2 characters";
    errors.all = false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = "Email is required";
    errors.all = false;
  } else if (!emailRegex.test(email)) {
    errors.email = "Please enter a valid email";
    errors.all = false;
  }

  // Password validation
  const { isValid } = validatePassword(password);
  if (!password) {
    errors.password = "Password is required";
    errors.all = false;
  } else if (!isValid) {
    errors.password = "Password must meet all requirements";
    errors.all = false;
  }

  // Confirm password validation
  if (!confirmPassword) {
    errors.cPassword = "Please confirm your password";
    errors.all = false;

  } else if (password !== confirmPassword) {
    errors.cPassword = "Passwords do not match";
    errors.all = false;

  }
  if(errors.all  && await isExist(email)){
    errors.userExist = "user already exist";
    errors.all = false;
    
  }

  return errors;
};

async function isExist(email){

    let response = await userAxiosInstance.post("/exist",{email})
    if(response.data.status && response.data.userExist) return true
    return false
}



export default validateForm;
