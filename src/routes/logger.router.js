express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.error('Error fatal');
  req.logger.debug('Mensaje de debug');
  console.log('Mensaje de Info');
  req.logger.warning('Mensaje de Warning');
  res.send('aqui has entrado a la ruta del Test de logs');
});

module.exports = router;
