import React from 'react';

type PostCount = {
   totalPosts: number;
};

type Props = {
   /** Page number that lives in state. */
   page: number;
   /** setPage state action */
   setPage: React.Dispatch<React.SetStateAction<number>>;
   /** The total amount of posts coming from gql backend */
   postCount: PostCount;
};

const PostPagination = ({ page, setPage, postCount }: Props): React.ReactElement => {
   let totalPages = Math.ceil(postCount && postCount.totalPosts / 4);

   const pagination = () => {
      if (totalPages > 10) totalPages = 10;
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
         pages.push(
            <li key={i} className="m-3">
               <button
                  className={`rounded-full w-8 h-7 ${
                     page === i && 'bg-primary-300'
                  } hover:bg-primary-100 transition-colors`}
                  onClick={() => setPage(i)}
               >
                  {i}
               </button>
            </li>,
         );
      }
      return pages;
   };

   return (
      <ul className="flex justify-center my-5">
         <li className="my-3">
            <button
               className={`rounded-full w-16 h-7 ${page === 1 && 'disabled'} hover:bg-primary-100 transition-colors`}
               onClick={() =>
                  setPage((currentPage) => {
                     if (currentPage !== 1) return currentPage - 1;
                     else return currentPage;
                  })
               }
            >
               Prev
            </button>
         </li>
         {pagination()}
         <li className="my-3">
            <button
               className={`rounded-full w-16 h-7 ${
                  page === totalPages && 'disabled'
               } hover:bg-primary-100 transition-colors`}
               onClick={() =>
                  setPage((currentPage) => {
                     if (currentPage !== totalPages) return currentPage + 1;
                     else return currentPage;
                  })
               }
            >
               Next
            </button>
         </li>
      </ul>
   );
};

export default PostPagination;
