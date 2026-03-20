import React from 'react';

const SearchSuggestions = ({ suggestions }) => {
  return (
    <ul className="search-suggestions bg-white border">
      {suggestions.map((s) => (
        <li key={s} className="p-2 hover:bg-gray-100">{s}</li>
      ))}
    </ul>
  );
};

export default SearchSuggestions;
