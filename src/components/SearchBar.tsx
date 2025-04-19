import React from 'react'

function SearchBar() {
  return (
    <form className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search stocks..."
        className="border rounded px-2 py-1"
      />
      <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
        Search
      </button>
    </form>
  )
}

export default SearchBar