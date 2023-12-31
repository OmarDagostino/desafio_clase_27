import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2';
import {config} from '../../config/config.js';

const cartsCollection = config.CARTS_COLLECTION
const productCollection = config.PRODUCTS_COLLECTION

const cartSchema = new mongoose.Schema({
    products: [
      new mongoose.Schema(
        {
          productId: { 
            type:mongoose.Schema.Types.ObjectId, 
            ref:productCollection
          },
          quantity: { type: Number},
        },
        { _id: false } 
      ),
    ],
  });
  

export const cartModel = mongoose.model (cartsCollection,cartSchema)

const usersCollection = config.USERS_COLLECTION

const userSchema = new mongoose.Schema ({
    name : String,
    email: {type: String, unique:true},
    password : String,
    cartId : {required : true, type:mongoose.Schema.Types.ObjectId},
    typeofuser : String,
    age : Number,
    last_name : String
})

export const userModel = mongoose.model (usersCollection, userSchema)


const productsCollection = config.PRODUCTS_COLLECTION

const productSchema = new mongoose.Schema ({
    code : {type:String, unique:true, required:true},
    title: {type:String, required:true },
    description : {type:String, required:true },
    price: {type:Number, required:true },
    stock: {type:Number, required:true },
    category: {type:String, required:true },
    thumbnail: [],
    status: {type:Boolean, required:true}    
})

productSchema.plugin(mongoosePaginate); 

export const productModel = mongoose.model (productsCollection, productSchema)


const chatsCollection = config.MESSAGES_COLLECTION

const chatSchema = new mongoose.Schema ({
    user : String,
   message : String
})

export const chatModel = mongoose.model (chatsCollection,chatSchema)
