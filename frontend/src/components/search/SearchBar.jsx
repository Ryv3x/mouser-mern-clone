import React from 'react';

const SearchBar = ({ value, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="search-bar">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search products..."
        className="border p-2 w-full"
      />
    </form>
  );
};

export default SearchBar;
