class CustomError{
   static createError({name= "Error",cause ="desconocido",messaje,code=1}){
    const error = new Error(mensaje);
    error.name= name;
    error.cause= cause;
    error.code= code;
    throw error;

    }
}

module.exports =CustomError;