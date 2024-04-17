const { EErrors } = require("../services/errors/enums.js");
const { generateInfoError } = require("../services/errors/info.js");


function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMessage = "Error interno del servidor";

  switch (err.code) {
    case EErrors.RUTA_ERROR:
      statusCode = 404;
      errorMessage = "La ruta solicitada no existe";
      generateInfoError(EErrors.RUTA_ERROR);
      break;
    case EErrors.TIPO_INVALIDO:
      statusCode = 400;
      errorMessage = "El tipo de solicitud es inválido";
      generateInfoError(EErrors.TIPO_INVALIDO);
      break;
    case EErrors.BD_ERROR:
      statusCode = 500;
      errorMessage = "Error en la base de datos";
      generateInfoError(EErrors.BD_ERROR);
      break;
    case EErrors.PRODUCTO_EXISTENTE:
      statusCode = 409;
      errorMessage = "El producto ya existe";
      generateInfoError(EErrors.PRODUCTO_EXISTENTE);
      break;
    case EErrors.PRODUCTO_NO_ENCONTRADO:
      statusCode = 404;
      errorMessage = "El producto no fue encontrado";
      generateInfoError(EErrors.PRODUCTO_NO_ENCONTRADO);
      break;
    case EErrors.AGREGAR_PRODUCTO_AL_CARRITO:
      statusCode = 400;
      errorMessage = "Error al agregar el producto al carrito";
      generateInfoError(EErrors.AGREGAR_PRODUCTO_AL_CARRITO);
      break;
    default:
      statusCode = 500;
      errorMessage = "Error interno del servidor";
  }

  res.status(statusCode).json({
    error: {
      message: errorMessage,
      statusCode: statusCode
    }
  });
}

module.exports = errorHandler;