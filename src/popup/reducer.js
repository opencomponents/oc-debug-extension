import {List, Map} from 'immutable';
import * as c from './constants'

function getStateFromPayload(payload) {
  var amend = {};
  amend[payload.name] = {
    versions: payload.allVersions
  };
  amend[payload.name][payload.version] = {
    description: payload.description,
    repository: payload.repository,
    parameters: payload.oc.parameters
  };
  return amend;
}

function getStateFromLocalPayload(payload) {
  var amend = {};
  amend[payload.name] = {
    versions: payload.allVersions,
    baseHref: `http://localhost:3000/${payload.name}/`,
    registryHref: "http://localhost:3000/"
  };
  amend[payload.name]['local'] = {
    description: payload.description,
    repository: payload.repository,
    parameters: payload.oc.parameters
  };
  return amend;
}
function getInitialState(initialState) {
  var amend = initialState;
  var componentKeys = Object.keys(initialState);
  componentKeys.forEach(function(key) {
    amend[key].renderedComponent._originalParameters = amend[key].renderedComponent.parameters;
  });
  return amend;
}

function editParameter(state, action) {
  return state.setIn([action.component, 'renderedComponent', 'parameters', action.parameter], action.value);
}
function reload(state, action) {
  var originalParameters = state.getIn([action.component, 'renderedComponent', '_originalParameters']);
  return state.setIn([action.component, 'renderedComponent', 'parameters'], originalParameters);
}
export default function(state = Map(), action) {
  let newState = state;
  switch (action.type) {
    case c.SET_STATE:
      newState = state.mergeDeep(getInitialState(action.state));
      break;
    case c.REQUEST_COMPONENT_SUCCESS:
      newState = state.mergeDeep(getStateFromPayload(action.payload));
      break;
    case c.REQUEST_LOCAL_COMPONENT_SUCCESS:
      newState = state.mergeDeep(getStateFromLocalPayload(action.payload));
      break;
    case c.REQUEST_COMPONENT_FAILURE:
      newState = null;
      break;
    case c.EDIT_PARAMETER:
      newState = editParameter(state, action);
      break;
    case c.RELOAD:
      newState = reload(state, action);
      break;
    default:
      newState = state;
  }
  return newState;
}