import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';



@Schema({ timestamps: true })
export class Produit {

  @Prop({ required: true })
  name: string;


  @Prop({ required: true })
  description: string;


  @Prop({ required: true })
  price: number;


  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  sellerId: Types.ObjectId;


  @Prop({
    type: [String],
  })
  genres: string[];


  @Prop({
    type: [String],
  })
  platforms: string[];


  @Prop()
  coverImage: string;


  @Prop([String])
  galleryImages: string[];


  @Prop({
    default: true,
  })
  isActive: boolean;


  @Prop({
    default: 0,
  })
  salesCount: number;

}

export type ProduitDocument =
  HydratedDocument<Produit>;
export const ProduitSchema =
  SchemaFactory.createForClass(Produit);