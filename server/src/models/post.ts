import { model, Schema, Model, Document } from 'mongoose';
import { nanoid } from 'nanoid';

interface Image {
  url: string;
  public_id: string;
}

interface PostedBy {
  _id: string;
  username?: string;
}

interface Post extends Document {
  _id: string;
  content: string;
  image: Image;
  postedBy: PostedBy;
}

const postSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    content: {
      type: String,
      required: 'Content is required',
      text: true,
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

export const Post: Model<Post> = model('Post', postSchema);
