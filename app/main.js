import './main.scss'
import template from './main.html'

import { ApiService } from './services/api'
import { Map } from './components/map/map'
import { InfoPanel } from './components/info-panel/info-panel'
import { LayerPanel } from './components/layer-panel/layer-panel'
import { SearchService } from './services/search'
import { SearchBar } from './components/search-bar/search-bar'

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
    this.searchService = new SearchService()
  }

  /** Initialize Components with data and event listeners */
  initializeComponents () {
    // Initialize Info Panel
    this.infoComponent = new InfoPanel('info-panel-placeholder', {
      data: { apiService: this.api }
    })
    // Initialize Map
    this.mapComponent = new Map('map-placeholder', {
      events:  { locationSelected: event => {
        // show data in infoComponent on "locationSelected" event
        const { name, id, type } = event.detail
        this.infoComponent.showInfo(name, id, type)
      }}
    })

    // Initialize layer toggle panel
    this.layerPanel = new LayerPanel('layer-panel-placeholder', {
      data: { layerNames: ['kingdom', ...this.locationPointTypes] },
      events: { layerToggle:
      // Toggle layer in map controller on layerToggle event
        event => {this.mapComponent.toggleLayer(event.detail) }
      }
    })

    // Initialize search panel
    this.searchBar = new SearchBar('search-panel-placehoder', {
      data: { searchService: this.searchService },
      events: { resultsSelected: event => {
        // Show result on map when selected from search results
        let searchResult = event.detail
        if (!this.mapComponent.isLayerShowing(searchResult.layerName)) {
          // show result layer if currently hidden
          this.layerPanel.toggleMapLayer(searchResult.layerName)
        }
        this.mapCompnent.selectLocation(searchResult.id, searchResult.layerName)
      }}
    })
  }

  async loadMapData () {
    // download kingdom boundaries
    const kingdomsGeojson = await this.api.getKingdoms()

    // add data to search service
    this.searchService.addGeoJsonItems(kingdomGeojson, 'kingdom')

    // add data to map
    this.mapComponent.addKingdomGeojson(kingdomsGeojson)

    // show kingdom boundaries
    this.layerPanel.toggleMapLayer('kingdom')

    // download location point data
    for (let locationType of this.locationPointTypes) {
      // download GeoJSON and metadata
      const geojson = await this.api.getLocations(locationType)

      // add location data to search service
      this.searchService.addGeoJsonItems(geojson, locationType)

      // add data to map
      this.mapComponent.addLocationGeojson(locationType, geojson, this.getIconUrl(locationType))

      // diplay location layer
      this.layerPanel.toggleMapLayer(locationType)
    }
  }

  /** format icon URL for layer type **/
  getIconUrl (layerName) {
    return `https://cdn.patricktriest.com/atlas-of-thrones/icons/${layerName}.svg`
  }
}

window.ctrl = new ViewController()
