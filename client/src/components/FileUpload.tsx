import React, { useContext } from 'react';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import axios from 'axios';

import { AuthContext } from '../context/authContext';

type Images = {
   url: string;
   public_id: string;
};

type Props = {
   /** Set Loading in state */
   setLoading: (value: React.SetStateAction<boolean>) => void;
   /** userUpdate Mutation from the result of using the useMutation hook */
   userUpdate: any;
   /** Image array with url and public_id */
   images: Images[];
};

const FileUpload = ({ setLoading, userUpdate, images }: Props): React.ReactElement => {
   // Get state from AuthContext
   const { state } = useContext(AuthContext);

   const fileResizeAndUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Check if there are any files within the event to prevent null and also check the first file in the array
      if (e.target.files && e.target.files[0]) {
         try {
            setLoading(true);
            // Apply resizer properties to the file and get a URI
            Resizer.imageFileResizer(
               e.target.files[0],
               300,
               300,
               'JPEG',
               100,
               0,
               async (uri) => {
                  // Send the URI and auth credentials to the backend REST endpoint for upload to cloudinary
                  try {
                     const response = await axios.post(
                        `${process.env.REACT_APP_REST_ENDPOINT}/uploadimages`,
                        { image: uri },
                        {
                           headers: {
                              authtoken: state.user?.token,
                           },
                        },
                     );
                     // Call the userUpdate mutation and add the current and new image data from the response received. If Else used to work with multiple or single image.

                     await userUpdate({
                        variables: {
                           input: {
                              images: [...images, response.data],
                           },
                        },
                     });

                     // Set Loading to false which will also trigger the useQuery hook to fire and update the state with the new image data that was just added
                     setLoading(false);
                     toast.success('Image Upload Successful');
                  } catch (error) {
                     // Catch error if either our backend or Cloudinary is down
                     toast.error(`Image Upload Failed. Our servers are down. Error: ${error}`);
                     setLoading(false);
                  }
               },
               'base64',
               200,
               200,
            );
         } catch (err) {
            console.log(err);
         }
      }
   };

   const handleImageRemove = async (public_id: string) => {
      setLoading(true);
      try {
         // Send the Public_ID of the image and auth details to our REST endpoint which will remove the image from Cloudinary
         await axios.post(
            `${process.env.REACT_APP_REST_ENDPOINT}/removeimage`,
            { public_id },
            {
               headers: {
                  authtoken: state.user?.token,
               },
            },
         );

         // Loop through the images state and remove the image with matching public_id. If there is an array then remove only the matching public_id otherwise simply set the url and public_id to blank

         const filteredImages = images.filter((image) => {
            return image.public_id !== public_id;
         });

         // Send the newly filtered image array to our GQL backend with the useMutation hook
         await userUpdate({
            variables: {
               input: {
                  images: filteredImages,
               },
            },
         });

         // Set Loading to false which will trigger useQuery hook on re-render to update state to the newest image data
         setLoading(false);
         toast.success('Image deleted successfully!');
      } catch {
         setLoading(false);
         toast.error('There was a problem deleting your image.');
      }
   };

   return (
      <div className="grid grid-cols-12 gap-4">
         <div className="col-span-3">
            <div className="mb-3">
               <label className="text-primary-300 btn btn-primary cursor-pointer">
                  Upload Image
                  <input
                     type="file"
                     accept="image/*"
                     onChange={fileResizeAndUpload}
                     placeholder="Image"
                     className="mt-2 px-0.5 focus:ring-0 focus:border-indigo-300 disabled:bg-gray-100 disabled:opacity-70 hidden"
                  />
               </label>
            </div>
         </div>
         <div className="col-span-9">
            {images.map((image) => (
               <div key={image.public_id} className="float-right h-36 relative">
                  <div className="absolute top-3 right-3">
                     <img
                        className="cursor-pointer"
                        src="https://img.icons8.com/windows/30/000000/macos-close.png"
                        onClick={() => handleImageRemove(image.public_id)}
                     />
                  </div>
                  <img src={image.url} alt={image.public_id} className="h-full" />
               </div>
            ))}
         </div>
      </div>
   );
};

export default FileUpload;
