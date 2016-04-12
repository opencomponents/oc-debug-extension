'use strict';

var qs = require('qs');

function getComponents() {
    function getBaseHref(href, name) {
        return href.substr(0, href.indexOf(name) + name.length + 1);
    }

    var ocComponents = document.getElementsByTagName('oc-component');
    var state = {};
    [].forEach.call(ocComponents, function(component) {
        var name = component.getAttribute('data-name');
        var href = component.getAttribute('href');
        var version = component.getAttribute('data-version');
        state[name] = {};
        state[name].baseHref = getBaseHref(href, name);
        state[name].renderedComponent = {};
        state[name].renderedComponent.version = version;
        state[name].renderedComponent.parameters = qs.parse(href.substr(href.indexOf('?') + 1));
    });
    return state;
}

function updateComponents(msg) {
    var ocComponents = document.getElementsByTagName('oc-component');
    [].forEach.call(ocComponents, function(component) {
        if (component.getAttribute('data-name') == msg.name) {
            component.setAttribute('data-version', msg.version);
            component.setAttribute('data-rendered', 'false');
            component.setAttribute('href', msg.baseHref + msg.version + '/?' + qs.stringify(msg.parameters));
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