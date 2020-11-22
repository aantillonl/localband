module.exports = function(hometownUri) {
  return `
        PREFIX dbpedia: <http://dbpedia.org/ontology/>

        SELECT DISTINCT ?bandName
        WHERE {
            ?band rdf:type dbpedia:Band;
            foaf:name ?bandName.
            ?band dbpedia:hometown <${hometownUri}> .
            FILTER langMatches(lang(?bandName),'en')
        }
        LIMIT 20`;
};
