
export const userValidation = (formData) => {
    let isValid = true; // Default to true
    let error = {}; // Initialize error object
  
    const { firstName, lastName, mobileNo } = formData;
  
    console.log(firstName, lastName, mobileNo);
    console.log(formData);
  
    // Validate first name
    if (!firstName || firstName.length < 3) {
      isValid = false;
      error.firstName = "First name needs 3 or more characters";
    }
  
    // Validate mobile number
    let mobileExp = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
    if (!mobileExp.test(mobileNo)) {
      isValid = false;
      error.mobileNo = "Enter a valid mobile number";
    }
  
    // If valid, return false to indicate no errors
    if (isValid) {
      return false;
    }
  
    // Return errors if validation fails
    return error;
};