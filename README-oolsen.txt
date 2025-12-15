
This is a modified version of the "Glance" demo from Kitware which can be found
at https://github.com/Kitware/glance

The modifications comprise essentially of removing the "Landing" module, keeping
only the "App" module, and modify this to automatically load data from a url given
in the query-parameter "model".

This "App" can now be loaded by a web-browser like e.g this

http://glance.oolsen.no/App?model=http://data.oolsen.no/someModel/someLoadcase.vtu

where the App-module is hosted at http://glance.oolsen.no/App and the data to
load is found at http://data.oolsen.no/someModel/someLoadcase.vtu

NOTE THAT data is loaded via XHR, meaning that CORS-settings might have to be
configured accordingly in the webserver.

A file "static/index2.html" is povided as the landing-page.
It loads the modified GLANCE-application into its IFRAME and provides a url
for loading data to display in the model-queryParamter. E.g.


http://glance.oolsen.no?model=http://data.oolsen.no/someModel/someLoadcase.vtu



# Building need to tweak crypto-engine like this
NODE_OPTIONS='--openssl-legacy-provider' npm run dev
NODE_OPTIONS='--openssl-legacy-provider' npm run build:release





