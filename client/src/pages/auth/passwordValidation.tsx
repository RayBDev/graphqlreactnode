type Validators = {
   /** Determines if password has at least one lowercase letter */
   hasLowercase: boolean;
   /** Determines if password has at least one uppercase letter */
   hasUppercase: boolean;
   /** Determines if password has at least one number */
   hasNumber: boolean;
   /** Determines if password has at least one special character */
   hasSpecialChar: boolean;
   /** Determines if password is between 8 and 32 characters */
   isLongEnough: boolean;
};

const passwordValidation = (password: string): Validators => {
   const validators: Validators = {
      hasLowercase: false,
      hasUppercase: false,
      hasNumber: false,
      hasSpecialChar: false,
      isLongEnough: false,
   };
   if (password.match(/(?=.*[a-z])/)) validators.hasLowercase = true;

   if (password.match(/(?=.*[A-Z])/)) validators.hasUppercase = true;

   if (password.match(/(?=.*[0-9])/)) validators.hasNumber = true;

   if (password.match(/(?=.*[*.!@$%^&(){}[\]:;<>,\\\?\/~_\+\-=\|])/)) validators.hasSpecialChar = true;

   if (password.length > 8 && password.length < 128) validators.isLongEnough = true;

   return validators;
};

export default passwordValidation;
