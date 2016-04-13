'use strict';

var qs = require('qs');
var url = require('url');

function getComponents() {
  function removeVersion(componentName, pathname) {
    var split = pathname.split('/');
    while (split.length > 0) {
      var lastValue = split.pop();
      if (lastValue == componentName) {
        return `${split.join('/')}/${componentName}/`;
      }
    }
    return null;
  }

  var ocComponents = document.getElementsByTagName('oc-component');
  var state = {};
  [].forEach.call(ocComponents, function(component) {
    var name = component.getAttribute('data-name');
    var href = component.getAttribute('href');
    if (href.startsWith('//')) {
      href = location.protocol + href;
    }
    var parsedHref = url.parse(href, true);
    if (parsedHref.protocol != 'http:' || parsedHref.protocol != 'https:') {
      parsedHref.protocol = location.protocol;
    }
    var baseHref = `${parsedHref.protocol}//${parsedHref.host}${removeVersion(name, parsedHref.pathname)}`;
    state[name] = {};
    state[name].baseHref = baseHref;
    state[name].renderedComponent = {};
    state[name].renderedComponent.version = component.getAttribute('data-version');
    state[name].renderedComponent.parameters = parsedHref.query;
  });
  return state;
}

function updateComponents(msg) {
  var ocComponents = document.getElementsByTagName('oc-component');
  [].forEach.call(ocComponents, function(component) {
    if (component.getAttribute('data-name') == msg.name) {
      component.setAttribute('data-version', msg.version);
      component.setAttribute('data-rendered', 'false');
      component.setAttribute('href', `${msg.baseHref}${msg.version}/?${qs.stringify(msg.parameters)}`);
      var script = document.createElement('script');
      script.appendChild(document.createTextNode('window.oc.renderUnloadedComponents()'));
      (document.body || document.head || document.documentElement).appendChild(script);
    }
  });
}


chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  switch (msg.type) {
    case 'GET_COMPONENTS':
      return response({type: 'SET_STATE', state: getComponents()});
    case 'APPLY':
      return response({type: 'APPLIED_CONFIG', state: updateComponents(msg)});
  }
});

document.addEventListener('DOMNodeInserted', function(event) {
  var numberOfComponents = document.getElementsByTagName('oc-component').length;
  if (numberOfComponents > 0) {
    chrome.runtime.sendMessage({type: 'UPDATE_BADGE', state: numberOfComponents});
  }
});

(function() {
  var numberOfComponents = document.getElementsByTagName('oc-component').length;
  if (numberOfComponents > 0) {
    chrome.runtime.sendMessage({type: 'UPDATE_BADGE', state: numberOfComponents});
  }
})();
