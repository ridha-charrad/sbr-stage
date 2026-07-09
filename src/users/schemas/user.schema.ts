import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true, select: false }) 
  passwordHash: string;
  @Prop({ default: true })
  isVerified: boolean;

  @Prop({ default: 'user' })
  role: 'user' | 'admin' | 'vendor' | 'support';
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);