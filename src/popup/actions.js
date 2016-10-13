import * as c from './constants'

export function requestComponent(href) {
  return {
    type: c.REQUEST_COMPONENT,
    payload: {
      request: {
        url: `${href}`
      }
    }
  }
}

export function requestLocalComponent(name) {
  return {
    type: c.REQUEST_LOCAL_COMPONENT,
    payload: {
      request: {
        url: `http://localhost:3000/${name}/~info`
      }
    }
  }
}

export function reload(component) {
  return {
    type: c.RELOAD,
    component
  }
}

export function apply(name, version, renderedComponent, baseHref) {
  return {
    type: c.APPLY,
    name,
    version,
    baseHref,
    parameters: renderedComponent.parameters
  }
}

export function editParameter(component, version, parameter, value) {
  return {
    type: c.EDIT_PARAMETER,
    component,
    version,
    parameter,
    value
  }
}