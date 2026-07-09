

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Produit', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  coverImage: string;

  @Prop({ type: [String], required: true })
  platforms: string[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  sellerId: Types.ObjectId;
  
  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  unitPrice: number;

  @Prop({ required: true, min: 0 })
  itemTotal: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [OrderItemSchema],
    required: true,
  })
  items: OrderItem[];

  @Prop({ required: true, min: 0 })
  totalPrice: number;

  @Prop({
    enum: ['pending', 'paid', 'cancelled', 'refunded'],
    default: 'pending',
  })
  status: string;

  @Prop()
  receiptNumber?: string;

  @Prop()
  receiptPath?: string;

  @Prop()
  paidAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);