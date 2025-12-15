[Glance]: https://kitware.github.io/glance/
[Kitware]: http://www.kitware.com

This is a modified version of the [Glance][] demo from [Kitware][].

Modifications
==============
The modifications comprise essentially of removing the "Landing" module, keeping
only the "App" module, and modify this to automatically load data from a url given
in the query-parameter "model". NOTE THAT there is probably a lot more that can
be pruned from the demo from Kitware - I have removed what's obvious and what
needed to get the desired functionality.

This modified "App" can now be loaded by a web-browser like e.g this

`http://glance.oolsen.no/App?model=http://data.oolsen.no/someModel/someLoadcase.vtu`

where the App-module is hosted at `http://glance.oolsen.no/App` and the data is at
`http://data.oolsen.no/someModel/someLoadcase.vtu`

(NOTE THAT data is loaded via XHR, meaning that CORS-settings might have to be
configured in the webserver for data to load.)

A file "index.html" is povided as an example of a new landing-page. It demonstrates
how to keep a list of load-cases in a dropdown and load the "App" in an IFRAME
loading the selection from the dropdown. It is provided as an example and POC.


Develo and Run
==============
Refer to instructions in the original [Glance][] repository for build-options
and hints about how to run the application.

I have found that when building on e.g. an EC2-host you need to set crypto-engine
by tweaking options for node like this

`NODE_OPTIONS='--openssl-legacy-provider' npm run dev`

and

`NODE_OPTIONS='--openssl-legacy-provider' npm run build:release`

In the POC I 