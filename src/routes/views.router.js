const express = require('express');
const router = express.Router();
const ViewsController = require("../dao/controllers/view.controller.js");
const viewsController= new ViewsController();
const passport= require("passport");
const checkUserRole = require("../middleware/checkrole.js");
// Configura Passport.js - Asegúrate de que passport esté correctamente configurado en tu aplicación
require("../config/passport.config")(passport);


//GET - Mostrar Todos los Productos en "/" -  
router.get('/', viewsController.getProducts);
      
//GET - Mostrar productos en tiempo real en "/realtimeproducts"
router.get('/realtimeproducts', checkUserRole(['admin']),viewsController.realTimeProducts);

//GET - Mostrar Chat en "/chat"
router.get("/chat", viewsController.chat);

//GET - mostrar productos en /products 
router.get('/products', viewsController.Products);

//Login
router.get("/login", viewsController.login);

//Registro
router.get("/register", viewsController.register);

//Perfil
router.get("/profile", viewsController.profile);


module.exports = router;
