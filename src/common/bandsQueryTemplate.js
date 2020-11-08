module.exports = function(hometownUri) {
  return `
        PREFIX dbpedia: <http://dbpedia.org/ontology/>

        SELECT DISTINCT ?band
        WHERE {
            ?band rdf:type dbpedia:Band .
            ?band dbpedia:hometown <${hometownUri}> .
        }
  
        LIMIT 5`;
};
