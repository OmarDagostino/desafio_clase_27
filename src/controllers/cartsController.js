import { ObjectId } from 'mongodb';
import { productServices } from '../services/productsServices.js';
import {cartModel} from '../dao/models/user.model.js';
import {cartsServices} from '../services/cartsServices.js'

// GET para retornar un carrito por su ID
async function getCarrito (req, res) {
  try {
    const cartId = req.params.cid;
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador del carrito invalido");
      } else {
        const cart = await cartsServices.obtenerCarrito(cid);
        if (cart) {
          res.json(cart);
        } else {
          res.status(404).send('Carrito no encontrado');
        }
      }
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
};

// POST para agregar un producto a un carrito existente
async function agregarProducto(req, res) {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = 1;
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      
      res.status(404).send("Identificador del carrito invalido");
      } else {
        const cart = await cartsServices.obtenerCarritoSinPopulate(cartId);
        if (!cart) {
          res.status(404).send('Carrito no encontrado');
          return;
        }

        // Añadir el producto al carrito

        const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
        if (!validObjectId) { 
          res.status(404).send("Identificador de Producto invalido");
          return;
          } else {
            const existingProduct = cart.products.find((p) => p.productId == productId);
            if (existingProduct) {
              existingProduct.quantity += quantity;
            } else {
                const product = await productServices.obtenerProducto(productId);
                if (product) {
                  cart.products.push({ productId, quantity })
                } else {
                  res.status(404).send('Producto no encontrado');
                  return;
                };
              }
            cartsServices.actualizarCarrito(cart,cartId)
            res.status(201).json(cart);
        }
      }
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
};

// POST para crear un nuevo carrito
async function crearCarrito(req, res) {
    try {
      const productId = req.params.pid;
      const quantity = 1;
  
      // Verificar si el producto existe en la base de datos de productos
      const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
      if (!validObjectId) { 
        res.status(404).send("Identificador de Producto invalido");
        } else {
      const product = await obtenerProducto(productId);
  
      if (!product) {
        res.status(404).send('Producto no encontrado');
        return;
      }
  
      const newCart = new cartModel({
        products: [{ productId, quantity }]
      });
     
      await cartsServices.crearCarrito(newCart);
      res.status(201).json(newCart);
    }
    } catch (error) {
      res.status(500).send(`Error en el servidor ${error}`);
    }
  };

// DELETE para eliminar un producto de un carrito 
async function eliminarProductoDelCarrito (req, res) {
  try {
    const cartId = req.params.cid;
    const productIdToFind = req.params.pid;

    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador del carrito invalido");
      } else {

        const cart = await cartsServices.obtenerCarrito(cartId);

        if (!cart) {
          res.status(404).send('Carrito no encontrado');
          return;
        }

        const validObjectId = ObjectId.isValid(productIdToFind) ? new ObjectId(productIdToFind) : null;

        if (!validObjectId) { 
          res.status(404).send("Identificador de Producto invalido");
          } 
          else {
            const indice  = cart.products.findIndex((product) => String(product.productId) === productIdToFind);
            if (indice!==-1) {
            cart.products.splice(indice,1)
            }
            else {
                  res.status(404).send('Producto no encontrado');
                  return;
            };
          }

            await cartsServices.actualizarCarrito (cart,cartId);
            res.status(201).json(cart);
        }
      
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
};

// DELETE para eliminar todos los productos de un carrito 
async function eliminarTodosProductosDelCarrito (req, res) {
    try {
      const cartId = req.params.cid;

      const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
      if (!validObjectId) { 
        res.status(404).send("Identificador del carrito invalido");
        } else {

          const cart = await cartsServices.obtenerCarrito(cartId);

          if (!cart) {
            res.status(404).send('Carrito no encontrado');
            return;
          } else {
            cart.products.length=0;
            await cartsServices.actualizarCarrito(cart,cartId);
            res.status(201).json(cart);
          }

        }
      }
      catch (error) {
        res.status(500).send('Error en el servidor');
    }
  };

// PUT para actualizar la cantidad de un producto de un carrito existente
async function actualizarCantidadDeUnProducto(req, res) {
  try {
    const cartId = req.params.cid;
    const productIdToFind = req.params.pid;
    const cantidad = parseInt(req.body.quantity);
    if (isNaN(cantidad) || cantidad<=0) {
      res.status(404).send('La cantidad debe ser un número positivo mayor que cero');
      return
    }
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador del carrito invalido");
      } else {        
        const cart = await cartsServices.obtenerCarrito(cartId);
        if (!cart) {
          res.status(404).send('Carrito no encontrado');
          return;
        }
        const indice  = cart.products.findIndex((product) => String(product.productId) === productIdToFind);
            if (indice!==-1) {    
              cart.products[indice].quantity=cantidad;
              await cartsServices.actualizarCarrito(cart,cartId);
              res.status(201).json(cart);
            } else { 
              res.status(404).send('Producto no encontrado');
              return;                    
            };
      }
  }
   catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
};


// PUT para actualizar todos los elementos de un carrito
async function actualizarTodoElCarrito(req, res) {
  try {
    const cartId = req.params.cid;
    const nuevoCarrito = req.body;    
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador del carrito invalido");
      return;
      }        
    const cart = await cartsServices.obtenerCarrito(cartId);
    if (!cart) {
          res.status(404).send('Carrito no encontrado');
          return;
      }
  
  if (Array.isArray(nuevoCarrito.products) && nuevoCarrito.products.length > 0) {
  
    const validacionExitosa = await Promise.all(
      nuevoCarrito.products.map(async (item) => {
              
        if (!ObjectId.isValid(item.productId)) { 
         
          return false; 
        }
     
        const productExists = await productServices.obtenerProducto(item.productId); 
 
        return productExists && typeof item.quantity === 'number' && item.quantity > 0;
      })
    );

    if (validacionExitosa.every((isValid) => isValid)) {
      cart.products=nuevoCarrito.products
    
      await cartsServices.actualizarCarrito(cart,cartId);
      res.status(200).json({ mensaje: 'Carrito actualizado con éxito' });
    } else {
      res.status(400).json({ error: 'El contenido del carrito no es válido' });
    }
  } else {
    res.status(400).json({ error: 'El contenido del carrito esta vacio o no es valido' });
  }
      }
   catch (error) {
    res.status(500).send('Error en el servidor');
  }
};

export default {getCarrito ,agregarProducto, crearCarrito,eliminarProductoDelCarrito ,eliminarTodosProductosDelCarrito, actualizarCantidadDeUnProducto, actualizarTodoElCarrito } 
