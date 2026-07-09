import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProduitDocument = HydratedDocument<Produit>;

@Schema({ timestamps: true })
export class Produit {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  sellerId: Types.ObjectId;

  @Prop({
    type: [String],
    enum: [
      'Action',
      'Adventure',
      'RPG',
      'MMORPG',
      'FPS',
      'TPS',
      'Open World',
      'Survival',
      'Horror',
      'Sports',
      'Racing',
      'Fighting',
      'Strategy',
      'RTS',
      'Simulation',
      'Sandbox',
      'Puzzle',
      'Platformer',
      'Battle Royale',
      'MOBA',
      'Card Game',
      'Indie',
      'Casual',
      'Multiplayer',
      'Co-op',
    ],
  })
  genres: string[];

  @Prop({
    type: [String],
    enum: [
      'PC',
      'PlayStation',
      'Xbox',
      'Nintendo Switch',
      'Mobile',
    ],
  })
  platforms: string[];

  @Prop()
  coverImage: string;

  @Prop([String])
  galleryImages: string[];

  @Prop({ default: 0 })
  salesCount: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const ProduitSchema =
  SchemaFactory.createForClass(Produit);