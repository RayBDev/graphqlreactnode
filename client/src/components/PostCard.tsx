import React from 'react';
import { Link, useHistory } from 'react-router-dom';

type PostedBy = {
   /** ID of the user who made the post */
   _id: string;
   /** Username of the user you made the post */
   username: string;
};

type Image = {
   /** Post image url */
   url: string;
   /** Post image id */
   public_id: string;
};

type PostProps = {
   /** post id received from graphql server */
   _id: string;
   /** post content received from graphql server */
   content: string;
   /** image of the post */
   image: Image;
   /** post description received from graphql server */
   postedBy: PostedBy;
};

type RequiredProps = {
   post: PostProps;
};

type ConditionalDeleteProps =
   | {
        showDeleteButton?: false | undefined;
        handleDelete?: (postId: string) => string;
     }
   | {
        showDeleteButton?: true;
        handleDelete: (postId: string) => Promise<void>;
     };

type UpdateProp = {
   showUpdateButton?: boolean;
};

type Props = RequiredProps & ConditionalDeleteProps & UpdateProp;

const PostCard = ({
   post,
   showUpdateButton = false,
   showDeleteButton = false,
   handleDelete = (f) => f,
}: Props): React.ReactElement => {
   const history = useHistory();
   const { _id, image, content, postedBy } = post;

   return (
      <div className="flex flex-col rounded shadow-md p-10">
         <div className="border border-gray-400 p-1 rounded mb-5 m-auto">
            <img src={image.url} alt={postedBy.username} className="w-full" />
         </div>
         <Link to={`/user/${postedBy.username}`}>
            <h4 className="mb-4 text-primary-300">@{postedBy.username}</h4>
         </Link>
         <hr />
         <p className="my-5">{content}</p>
         <div className="text-center mt-5">
            {showDeleteButton && (
               <button className="btn btn-warning mx-4" onClick={() => handleDelete(_id)}>
                  Delete
               </button>
            )}
            {showUpdateButton && (
               <button className="btn btn-warning mx-4" onClick={() => history.push(`/post/update/${_id}`)}>
                  Update
               </button>
            )}
         </div>
      </div>
   );
};

export default PostCard;
