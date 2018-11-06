import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    locations: [],
    fetchError: false,
    center: {lat: 40.72477,lng: -74.002008}
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
    .then(this.renderMap)
    .catch((err) => {
      this.setState({fetchError:true});
    });
  }

  renderMap = () => {
    addScript(`https://maps.googleapis.com/maps/api/js?key=AIzaSyDr74hacqaOzOqckWb9TnmXYnk8AMyKCfk&callback=initMap`);
    window.initMap = this.initMap;
  }

  initMap = () => {
    let map = new window.google.maps.Map(
      document.getElementById('map'), {zoom: 17, center: this.state.center});
    
    let infoWindow = new window.google.maps.InfoWindow();
    this.state.locations.map((item) => {
      let marker = new window.google.maps.Marker({
        position: {lat: item.venue.location.lat, lng: item.venue.location.lng},
        map: map,
      });
      let contentString = `<p>${item.venue.name}</p><p>${item.venue.location.address}</p>`;
      marker.addListener('click', () => {
        infoWindow.setContent(contentString);
        infoWindow.open(map,marker);
      });
    })
  }

  render() {
    return (
      <div className="App">
        <div id="map"></div>
      </div>
    );
  }
}

function addScript(url) {
  const script = document.getElementsByTagName('script')[0];
  let newScript = document.createElement('script');
  newScript.src = url;
  newScript.async = true;
  newScript.defer = true;
  script.parentNode.insertBefore(newScript, script);
}

export default App;
