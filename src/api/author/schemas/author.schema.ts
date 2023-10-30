import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type AuthorDocument = HydratedDocument<Author>;

@Schema({ timestamps: true })
export class Author {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  })
  _id?: Types.ObjectId;

  @Prop({ required: true, text: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
