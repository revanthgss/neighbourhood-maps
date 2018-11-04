import React, { Component } from 'react';
import './App.css';

class App extends Component {
  renderMap = () => {
    window.initMap = this.initMap;
    addScript(`https://maps.googleapis.com/maps/api/js?key=AIzaSyDr74hacqaOzOqckWb9TnmXYnk8AMyKCfk&callback=initMap`);
  }

  initMap = () => {
    let map = new window.google.maps.Map(
      document.getElementById('map'), {zoom: 4, center: {lat: -25.344, lng: 131.036}});
  }

  componentDidMount() {
    this.renderMap();
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
