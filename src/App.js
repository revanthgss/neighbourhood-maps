import React, { Component } from 'react';
import './App.css';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import escapeRegExp from 'escape-string-regexp'

class App extends Component {
  markers = [];
  state = {
    locations: [],
    fetchError: false,
    query: '',
    center: {lat: 40.72477,lng: -74.002008}
  }

  updateQuery = (query) => {
    this.setState({query});
  }

  componentDidMount() {
    fetch(`https://api.foursquare.com/v2/venues/explore?client_id=QJ2RPGL0L5MVUQCYHDIO0PXBIRFHDPHC5VFVYVOWYQU5D0B3&client_secret=WQHUROLOPO0ZF1ASLZG0ANTJGKHNIF5DWN3FT5CVHCDV1N0I
    &v=20180323&limit=10&ll=${this.state.center.lat},${this.state.center.lng}&query=coffee`)
    .then((response) => {
        return response.json();
    })
    .then((response) => {
      this.setState({locations: response.response.groups[0].items});
    })
    .then(this.initMap)
    .catch((err) => {
      this.setState({fetchError:true});
    });
  }

  initMap = () => {
    let map = new window.google.maps.Map(
      document.getElementById('map'), {zoom: 17, center: this.state.center});
    
    let infoWindow = new window.google.maps.InfoWindow();
    this.state.locations.forEach((item) => {
      let marker = new window.google.maps.Marker({
        name: item.venue.name,
        position: {lat: item.venue.location.lat, lng: item.venue.location.lng},
        map: map,
      });
      this.markers.push(marker);
      let contentString = `<p>${item.venue.name}</p><p>${item.venue.location.address}</p>`;
      marker.addListener('click', () => {
        infoWindow.setContent(contentString);
        infoWindow.open(map,marker);
      });
    })
    this.setState({map});
  }

  clickMarker = (name) => {
    let marker = this.markers.filter((marker) => marker.name===name);
    new window.google.maps.event.trigger(marker[0], 'click');
  }

  componentDidUpdate() {
    this.updateMarkers();
  }

  updateMarkers = () => {
    let showingMarkers=this.markers;
    showingMarkers.forEach((marker) => {
      marker.setMap(null);
    })
    if(this.state.query){
      const match = new RegExp(escapeRegExp(this.state.query), 'i');
      showingMarkers = showingMarkers.filter((marker) => match.test(marker.name));
    }
    showingMarkers.forEach((marker) => {
      marker.setMap(this.state.map);
    })
  }

  render() {
    return (
      <div className="App">
        <div className="search-container">
          <SearchBar query={this.state.query} onUpdateQuery={this.updateQuery}/>
          <SearchResults query={this.state.query} locations={this.state.locations} onClickLocation={this.clickMarker}/>
        </div>
        <div id="map"></div>
      </div>
    );
  }
}

export default App;
