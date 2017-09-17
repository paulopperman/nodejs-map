import './main.scss'
import template from './main.html'

import { ApiService } from './services/api'
import { Map } from './components/map/map'
import { InfoPanel } from './components/info-panel/info-panel'

/** Main UI Controller Class */
class ViewController {
  /** Initialize application */
  constructor () {
    document.getElementById('app').outerHTML = template

    // Initialize API service
    if (window.location.hostname === 'localhost') {
      this.api = new ApiService('http://localhost:5000/')
    } else {
      this.api = new ApiService('https://api.atlasofthrones.com/')
    }

    this.locationPointTypes = ['castle', 'city', 'town', 'ruin', 'region', 'landmark']
    this.initializeComponents()
    this.loadMapData()
  }

  /** Initialize Components with data and event listeners */
  initializeComponents () {
    // Initialize Info Panel
    this.infoComponent = new InfoPanel('info-panel-placeholder')
    // Initialize Map
    this.mapComponent = new Map('map-placeholder')
  }

  async loadMapData () {
    // download kingdom boundaries
    const kingdomsGeojson = await this.api.getKingdoms()

    // add data to map
    this.mapComponent.addKingdomGeojson(kingdomsGeojson)

    // show kingdom boundaries
    this.mapComponent.toggleLayer('kingdom')

    // download location point data
    for (let locationType of this.locationPointTypes) {
      // download GeoJSON and metadata
      const geojson = await this.api.getLocations(locationType)

      // add data to map
      this.mapComponent.addLocationGeojson(locationType, geojson, this.getIconUrl(locationType))

      // diplay location layer
      this.mapComponent.toggleLayer(locationType)
    }
  }

  /** format icon URL for layer type **/
  getIconUrl (layerName) {
    return `https://cdn.patricktriest.com/atlas-of-thrones/icons/${layerName}.svg`
  }
}

window.ctrl = new ViewController()
