module.exports = function(hometownUri) {
  return `
        PREFIX dbpedia: <http://dbpedia.org/ontology/>

        SELECT DISTINCT ?bandName
        WHERE {
            ?band rdf:type dbpedia:Band;
            rdfs:label ?bandName.
            ?band dbpedia:hometown <${hometownUri}> .
        }`;
};
