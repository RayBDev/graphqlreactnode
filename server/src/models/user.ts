import { model, Schema, Model, Document } from 'mongoose';
import { nanoid } from 'nanoid';

interface Image {
  url: string;
  public_id: string;
}

interface IUser extends Document {
  _id: string;
  username: string;
  name: string;
  email: string;
  images: Image[];
  about: string;
}

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    username: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    images: {
      type: Array,
      default: [
        {
          url: 'https://res.cloudinary.com/tacticapps/image/upload/v1624277410/sample.jpg',
          public_id: 'sample',
        },
      ],
    },
    about: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> = model('User', userSchema);
