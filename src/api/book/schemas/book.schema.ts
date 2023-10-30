import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  })
  _id?: Types.ObjectId;

  @Prop({ required: true, text: true })
  name: string;

  @Prop({ default: () => '' })
  summary?: string;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'authors',
      },
    ],
    required: true,
  })
  authors: Types.ObjectId[];
}

export const BookSchema = SchemaFactory.createForClass(Book);
BookSchema.index({ authors: 1 });
