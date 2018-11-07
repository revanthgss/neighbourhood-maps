import React from 'react'

const SearchBar = (props) => (
    <div className="search-bar">
        <input value={props.query} onChange={(e) => props.onUpdateQuery(e.target.value)}></input>
    </div>
)

export default SearchBar