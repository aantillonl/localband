# localband
A tiny app that queries DBPedia to find local bands from a city based on users input.

[Demo](http://localband.alejandroantillon.com)

## How does it work?
Simple. It is a react/flux app which takes user's input and queries DBpedia for cities that match the user's input. Then it shows the user with the cities (top 5 results) that mached the input.

After the user selects one of the results, the app queries DBpedia again, this time for bands which are from that city. The app loads the top 15 results from the query. They are not sorted in any particular way, so sorry if your favorite local band is not on the list.

This App uses the SPARQL syntax to query DBpedia. More info on dbpedia.org.

## Stack
This project features the following technologies. Note there are plenty of areas of improvement,
but is intended to be a hobby project nonetheless

* React
* Redux tooklit
* Create React App
* Jest
* Cloudformation + Make Deployment
* Interact with 3rd party APIs
