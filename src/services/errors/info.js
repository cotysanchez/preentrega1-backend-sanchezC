const { EErrors } = require('./enums.js');


function generarInfoError(codigoError) {
  switch (codigoError) {
    case EErrors.RUTA_ERROR:
      return 'Error de ruta: la ruta solicitada no es válida.';
    case EErrors.TIPO_INVALIDO:
      return 'Error de tipo: el tipo de dato proporcionado no es válido.';
    case EErrors.BD_ERROR:
      return 'Error de base de datos: se produjo un error al interactuar con la base de datos.';
    case EErrors.PRODUCTO_EXISTENTE:
      return 'Error al crear producto: el producto ya existe en la tienda.';
    case EErrors.PRODUCTO_NO_ENCONTRADO:
      return 'Error al buscar producto: el producto no se encontró en la tienda.';
    case EErrors.AGREGAR_PRODUCTO_AL_CARRITO:
      return 'Error al agregar producto al carrito: se produjo un error al intentar agregar el producto al carrito de compras.';
    default:
      return 'Error desconocido.';
  }
}

module.exports = { generarInfoError };
