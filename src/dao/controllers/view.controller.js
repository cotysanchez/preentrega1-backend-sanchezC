const ProductService = require("../../services/productService.js");
const productService = new ProductService();


class ViewsController {
  //GET - Mostrar Todos los Productos en "/" - Incio en Login
  async getProducts(req, res) {
    try {
      if (!req.session.login) {
        return res.redirect('/login');
      } else {
        const productos = await productService.getProducts();
        res.render('login', { products: productos });
      }
    } catch (error) {
      console.log('Error al obtener productos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  //GET - Mostrar productos en tiempo real en "/realtimeproducts"
  async realTimeProducts (req,res){
    try {
        res.render('realtimeproducts', { titulo: 'productos en tiempo real' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
    }
    //GET - Mostrar Chat en "/chat"
    async chat (req,res){
        res.render('chat');
    }


    //GET - mostrar productos en /products
    async Products (req, res) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const products = await productService.getProducts({
        page: parseInt(page),
        limit: parseInt(limit),
        });

        if (!products.docs) {
        console.log(
            'Error: No se encontraron documentos en los productos obtenidos'
        );
        return res.status(500).json({ error: 'Error interno del servidor' });
        }

            const newArray = products.docs.map((product) => {
            const { _id, ...rest } = product.toObject();
            return rest;
            });

        res.render('products', {
        products: newArray,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        currentPage: products.page,
        totalPages: products.totalPages,
        user: req.session.user,
            });
        } catch (error) {
        console.log('Error al obtener productos:', error);
        res
        .status(500)
        .json({ status: 'error', error: 'Error interno del servidor' });
        }
    }
    //Login
    async login (req, res) {
        if (req.session.login) {
        return res.redirect('/products');
    }
    res.render('login');
    };

    // Registro
    async register (req, res){
        if (req.session.login) {
        return res.redirect('/profile');
    }
    res.render('register');
    };

    //Perfil
    async profile (req, res)  {
        if (!req.session.login) {
        return res.redirect('/login');
        }
        res.render('profile', { user: req.session.user });
    };

};

module.exports = ViewsController;
























