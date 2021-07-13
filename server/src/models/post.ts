import mongoose from 'mongoose';
import { Types } from 'mongoose';
import { nanoid } from 'nanoid';

const postSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    content: {
      type: String,
      required: 'Content is required',
    },
    image: {
      url: {
        type: String,
        default:
          'https://res.cloudinary.com/tacticapps/image/upload/v1624277410/sample.jpg',
      },
      public_id: {
        type: String,
        default: 'sample',
      },
    },
    postedBy: {
      type: String,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model('Post', postSchema);
