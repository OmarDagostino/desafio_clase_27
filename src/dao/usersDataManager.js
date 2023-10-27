import mongoose from 'mongoose';
import {cartModel} from './models/user.model.js';
import {userModel} from './models/user.model.js';
import {Router} from 'express';
import {createHash} from '../util.js';
import {config} from '../config/config.js'

const router = Router ()

// Conectar a la base de datos MongoDB Atlas
mongoose.connect(config.MONGO_URL);

// Clases para el Manejo de usuarios
export class usersDataManager { 



async obtenerUsuarioPorEmail (direccionDeCorreo)
{
  try {
       
    const existingUser = await userModel.findOne({ email: direccionDeCorreo.username}).exec();
    return existingUser
   }
   catch (error) {
    console.error(`Error en el servidor ${error}`);
    }

};

async obtenerUsuarioPorId   (id)
{
  try {
   
    const existingUser = await userModel.findOne({ _id: id}).exec();
    return existingUser
   }
   catch (error) {
    console.error(`Error en el servidor ${error}`);
    }

};

async crearUsuario  (name,email,password,typeofuser,last_name,age)
{
  let cartId
  try {
    const newCart = new cartModel({
      products: []
    });
    await newCart.save();
    cartId = newCart._id
  }
   catch (error) {
    consosle.error(error)
  }

  try {
    password=createHash(password);
    
    const user = new userModel({name,email,password,cartId,typeofuser,last_name, age});
    await user.save();
    return user;

   }
   catch (error) {
    console.error('*error en el servidor*');
    console.error(error);
    }
}

}

export default usersDataManager
