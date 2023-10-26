import {Router} from 'express';
import productsController from '../controllers/productsController.js'

const router = Router ()

// GET para retornar varios productos o todos
router.get('/products', productsController.getProducts);

// GET para retornar un producto por su ID
router.get('/products/:pid', productsController.getProductById);

// POST para crear un nuevo producto
router.post('/products', productsController.crearProducto);
  
// PUT para actualizar un producto por su ID
router.put('/products/:pid', productsController.actualizarProducto);

// DELETE para eliminar un producto por su ID
router.delete('/products/:pid', productsController.borrarProducto);

export default router;
