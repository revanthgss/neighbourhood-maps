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
    //Get the venues
    fetch(`https://api.foursquare.com/v2/venues/explore?client_id=QJ2RPGL0L5MVUQCYHDIO0PXBIRFHDPHC5VFVYVOWYQU5D0B3&client_secret=WQHUROLOPO0ZF1ASLZG0ANTJGKHNIF5DWN3FT5CVHCDV1N0I
    &v=20180323&limit=10&ll=${this.state.center.lat},${this.state.center.lng}&query=coffee`)
    .then((response) => {
        return response.json();
    })
    .then((response) => {
      this.setState({locations: response.response.groups[0].items});
    })
    //Initialize the map
    .then(this.initMap)
    .catch((err) => {
      this.setState({fetchError:true});
    });
  }

  initMap = () => {
    //Create Map
    let map = new window.google.maps.Map(
      document.getElementById('map'), {zoom: 17, center: this.state.center});
    //Create blank Infowindow
    let infoWindow = new window.google.maps.InfoWindow();
    //Initialize markers
    this.state.locations.forEach((item) => {
      let marker = new window.google.maps.Marker({
        name: item.venue.name,
        position: {lat: item.venue.location.lat, lng: item.venue.location.lng},
        map: map,
      });
      this.markers.push(marker);
      let contentString = `<p>${item.venue.name}</p><p>${item.venue.location.address}</p>`;
      //Event listener to show infowindow when marker is clicked
      marker.addListener('click', () => {
        infoWindow.setContent(contentString);
        infoWindow.open(map,marker);
        //Show animation for 1 second
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(() => {
          marker.setAnimation(null);
        },1000);
      });
    })
    this.setState({map});
  }

  clickMarker = (name) => {
    //Trigger click event for the marker having name
    let marker = this.markers.filter((marker) => marker.name===name);
    new window.google.maps.event.trigger(marker[0], 'click');
  }

  componentDidUpdate() {
    //UpdateMarkers when state changes
    this.updateMarkers();
  }

  updateMarkers = () => {
    let showingMarkers=this.markers;
    //Detach markers from the maps
    showingMarkers.forEach((marker) => {
      marker.setMap(null);
    })
    if(this.state.query){
      const match = new RegExp(escapeRegExp(this.state.query), 'i');
      showingMarkers = showingMarkers.filter((marker) => match.test(marker.name));
    }
    //Set map for the filtered markers
    showingMarkers.forEach((marker) => {
      marker.setMap(this.state.map);
    })
  }

  render() {
    return (
      <main className="App">
        <section className="search-container">
          <SearchBar query={this.state.query} onUpdateQuery={this.updateQuery}/>
          {this.state.fetchError && (
            <div className="search-results">We are unable to get the locations from FourSquare</div>
          )}
          {!this.state.fetchError && (
            <SearchResults query={this.state.query} locations={this.state.locations} onClickLocation={this.clickMarker}/>
          )}
        </section>
        <div id="map" role="application" aria-describedby="map-description"></div>
        <div id="map-description" hidden>A map showing all the restaurants near NewYork</div>
        <div role="contentinfo" id="footer">Powered by <a href="https://foursquare.com/" target="_blank" rel="noopener noreferrer">FourSquare</a></div>
      </main>
    );
  }
}

export default App;
