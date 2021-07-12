import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const userSchema = new mongoose.Schema(
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

export const User = mongoose.model('User', userSchema);
