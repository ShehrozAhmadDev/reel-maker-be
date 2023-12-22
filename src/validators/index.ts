export const passwordValidator = (v: any) => {
    return /^(?=.{8,19}$).*/.test(v);
  };
  
  export const emailValidator = (v: any) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  };