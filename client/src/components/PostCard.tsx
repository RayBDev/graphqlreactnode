import React from 'react';
import { Link } from 'react-router-dom';

type PostedBy = {
   /** ID of the user who made the post */
   _id: number;
   /** Username of the user you made the post */
   username: string;
};

type Image = {
   /** Post image url */
   url: string;
   /** Post image id */
   public_id: string;
};

type Post = {
   /** post id received from graphql server */
   _id: number;
   /** post content received from graphql server */
   content: string;
   /** image of the post */
   image: Image;
   /** post description received from graphql server */
   postedBy: PostedBy;
};

type Props = {
   post: Post;
};

const PostCard = ({ post }: Props): React.ReactElement => {
   return (
      <div className="flex flex-col rounded shadow-md p-10">
         <div className="border border-gray-400 p-1 rounded mb-5 m-auto">
            <img src={post.image.url} alt={post.postedBy.username} className="w-full" />
         </div>
         <Link to={`/user/${post.postedBy.username}`}>
            <h4 className="mb-4 text-primary-300">@{post.postedBy.username}</h4>
         </Link>
         <hr />
         <p className="my-5">{post.content}</p>
      </div>
   );
};

export default PostCard;
