import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import * as c from './constants';

import chromeMessageMiddleware from './chromeMessageMiddleware';
import chromeExtensionWrapper from './chromeExtensionWrapper';

import OCComponentListContainer from './components/OCComponentList';
import OCComponentContainer from './components/OCComponentContainer';

import App from './components/App';

import reducer from './reducer';

const client = axios.create({
    responseType: 'json'
});

function postMessage(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (callback) {
            chrome.tabs.sendMessage(tabs[0].id, message, callback);
        } else {
            chrome.tabs.sendMessage(tabs[0].id, message);
        }
    })
}

const store = createStore(reducer, applyMiddleware(chromeMessageMiddleware(postMessage), axiosMiddleware(client)));

postMessage({type: 'GET_COMPONENTS'}, (state)=>store.dispatch(state));

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route component={App}>
                <Route path="/" component={OCComponentListContainer}/>
                <Route path="/component/:component/:version" component={OCComponentContainer}/>
            </Route></Router>
    </Provider>,
    document.getElementById('app')
);