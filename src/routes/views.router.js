const express = require('express');
const router = express.Router();
const ViewsController = require("../dao/controllers/view.controller.js");
const viewsController= new ViewsController();
const passport= require("passport");
const checkUserRole = require("../middleware/checkrole.js");



//GET - Mostrar Todos los Productos en "/" -  
router.get('/', viewsController.getProducts);
      
//GET - Mostrar productos en tiempo real en "/realtimeproducts"
router.get('/realtimeproducts', checkUserRole(['admin']),viewsController.realTimeProducts);

//GET - Mostrar Chat en "/chat"
router.get("/chat",checkUserRole(['user']), viewsController.chat);

//GET - mostrar productos en /products 
router.get('/products', viewsController.Products);
/*
router.get(
  '/products',
  checkUserRole(['user']),
  passport.authenticate('jwt', { session: false }),
  viewsController.renderProducts
);
*/
//Render Cart
router.get('/carts/:cid', viewsController.renderCart);

//Login
router.get("/login", viewsController.login);

//Registro
router.get("/register", viewsController.register);

//Perfil
router.get("/profile", viewsController.profile);

router.get("/finishPurchase/:cid/ticket/:tid", viewsController.renderPurchase);








module.exports = router;
