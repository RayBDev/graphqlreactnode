import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Search = (): React.ReactElement => {
   const [query, setQuery] = useState('');

   const history = useHistory();

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      history.push(`/search/${query}`);
   };

   return (
      <form className="flex" onSubmit={(e) => handleSubmit(e)}>
         <input
            type="search"
            value={query}
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-primary-500 focus:outline-none"
            placeholder="Search"
            onChange={(e) => setQuery(e.target.value)}
         />
         <button className="btn btn-outline" type="submit">
            GO
         </button>
      </form>
   );
};

export default Search;
