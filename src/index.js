// import dotenv from 'dotenv';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line
import $ from 'jquery';
import 'jquery';
import { localDB } from './services/local-db.service';

// eslint-disable-next-line
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import App from './App.jsx';
import './index.scss';
import configureStore from './store';
// dotenv.config();

const injectGA = () => {
    if (typeof window == 'undefined') {
      return;
    }
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', 'UA-84488212-4');
};

const injectGTM = () => {
	(function(w,d,s,l,i){
		w[l]=w[l]||[];
		w[l].push({'gtm.start':
			new Date().getTime(),event:'gtm.js'
		});
		var f=d.getElementsByTagName(s)[0],
			j=d.createElement(s),
			dl=l!=='dataLayer'?'&l='+l:'';
		j.async=true;
		j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
		f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-5S5ZFKS');
}

$(function(){
    // eslint-disable-next-line
    var db = window.db = localDB;
});

ReactDOM.render(
    <Provider store={configureStore()}>
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-84488212-4"/>
        <script>{injectGA()}</script>
        <script>{injectGTM()}</script>
    		<noscript><iframe id="gtmThisId" title="gtmThisId" async src="https://www.googletagmanager.com/ns.html?id=GTM-5S5ZFKS" height="0" width="0" style={{display: "none", visibility: "hidden"}}></iframe></noscript>
        <App />
    </Provider>,
    document.getElementById('root')
);

serviceWorker.register();
