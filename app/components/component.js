/**
* Base componenet class to provide view ref binding, template insertion and event listener setup
**/
export class Component {
  /** SearchPanel Component Constructor
  * @param { String } placeholderId - Element ID to inflate the component into
  * @param { Object } props = Component properties
  * @param { Object } props.events - Component event listeners
  * @param { Object } props.data - Component data properties
  * @param { String } template - HTML template to inflate into placeholderId
  **/
  constructor (placeholderId, prop={}, template) {
    this.componentElem = document.getElementById(placeholderId)

    if (template) {
      // load template into placehholder element
      this.componentElem.innerHTML = template

      // find all refs in component
      this.refs = {}
      const refElems = this.componentElem.querySelectorAll('[ref]')
      refElems.forEach((elem) => { this.refs[elem.getAttribute('ref')] = elem })
    }

    if (props.events) {this.createEvents(props.events)}
  }

  /** Read "event" component parameters, and attach event listeners for each **/
  createEvents (events) {
    Object.keys(events).forEach((eventName) => {
      this.componentElem.addEventListener(eventName, events[eventName], false)
    })
  }

  /** Trigger a component event with the provided "detail" payload **/
  triggerEvent (eventName, detail) {
    const event = new window.CustomEvent(eventName, {detail})
    this.componentElem.dispatchEvent(event)
  }
}
