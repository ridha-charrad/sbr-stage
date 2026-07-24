import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { Produit } from '../../produit/schemas/produit.schema';
import { User } from '../../users/schemas/user.schema';
import { Order } from '../../orders/schemas/order.schema';


export type InventoryDocument = HydratedDocument<Inventory>;


@Schema({ timestamps:true })
export class Inventory {


  @Prop({
    type: Types.ObjectId,
    ref: Produit.name,
    required:true
  })
  productId: Types.ObjectId;



  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required:true
  })
  sellerId: Types.ObjectId;



  @Prop({
    enum:[
      "account",
      "key"
    ],
    required:true
  })
  type:string;



  @Prop()
  login?:string;



  @Prop()
  password?:string;



  @Prop()
  cdKey?:string;



  @Prop({
    enum:[
      "available",
      "reserved",
      "sold"
    ],
    default:"available"
  })
  state:string;



  @Prop({
    type:Types.ObjectId,
    ref:User.name
  })
  reservedBy?:Types.ObjectId;



  @Prop()
  reservedUntil?:Date;



  @Prop({
    type:Types.ObjectId,
    ref:User.name
  })
  soldTo?:Types.ObjectId;



  @Prop({
    type:Types.ObjectId,
    ref:Order.name
  })
  orderId?:Types.ObjectId;

}



export const InventorySchema =
  SchemaFactory.createForClass(Inventory);