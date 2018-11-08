import React from 'react'
import escapeRegExp from 'escape-string-regexp'

const SearchResults = (props) => {
    const { locations, query, onClickLocation} = props;
    let showingLocations;
    if(props.query){
        const match = new RegExp(escapeRegExp(query), 'i');
        showingLocations = locations.filter((location) => match.test(location.venue.name));
    } else {
        showingLocations = locations;
    }
    return (
        <ul className="search-results">
            {showingLocations.map((location) => (
                <li key={location.venue.id} role="button" onClick={() => {onClickLocation(location.venue.name)}}>{location.venue.name}</li>
            ))}
        </ul>
    )
}

export default SearchResults

