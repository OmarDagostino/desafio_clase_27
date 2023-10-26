import {Router} from 'express';
import cartsController from '../controllers/cartsController.js'

const router = Router ()

// Rutas para carritos

// GET para retornar un carrito por su ID
router.get('/carts/:cid', cartsController.getCarrito);

// POST para agregar un producto a un carrito existente
router.post('/carts/:cid/product/:pid', cartsController.agregarProducto);

// POST para crear un nuevo carrito
router.post('/carts/product/:pid', cartsController.crearCarrito);

// DELETE para eliminar un producto de un carrito 
router.delete('/carts/:cid/product/:pid', cartsController.eliminarProductoDelCarrito);

// DELETE para eliminar todos los productos de un carrito 
router.delete('/carts/:cid', cartsController.eliminarTodosProductosDelCarrito);

// PUT para actualizar la cantidad de un producto de un carrito existente
router.put('/carts/:cid/product/:pid', cartsController.actualizarCantidadDeUnProducto);


// PUT para actualizar todos los elementos de un carrito
router.put('/carts/:cid', cartsController.actualizarTodoElCarrito);

export default router;
