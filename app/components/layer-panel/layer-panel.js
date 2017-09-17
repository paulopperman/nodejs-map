import './layer-panel.scss'
import template from './layer-panel.html'
import { Component } from '../component'

/**
* Layer Panel Component
* Render and control layer-toggle side panel
*/
export class LayerPanel extends Component {
  constructor (placeholderId, props) {
    super(placeholderId, props, template)

    // toggle layer panel on click (mobile only)
    this.refs.toggle.addEventListener('click', () => this.toggleLayerPanel())

    // add a toggle button for each layer
    props.data.layerNames.forEach((name) => this.addLayerButton(name))
  }

  /** Create and append new layer button div */
  addLayerButton (layerName) {
    let layerItem = document.createElement('div')
    layerItem.textContent = `${layerName}s`
    layerItem.setAttribute('ref', `${layerName}-toggle`)
    layerItem.addEventListener('click', (e) => this.toggleMapLayer(layerName))
    this.refs.buttons.appendChild(layerItem)
  }

  /** Toggle the info panel (mobile only) */
  toggleLayerPanel () {
    this.refs.panel.classList.toggle('layer-panel-active')
  }

  /** Toggle map layer visisbility */
  toggleMapLayer (layerName) {
    // Toggle Active UI status
    this.componentElem.querySelector(`[ref=${layerName}-toggle]`).classList.toggle('toggle-active')

    // trigger layer toggle callback
    this.triggerEvent('layerToggle', layerName)
  }
}
