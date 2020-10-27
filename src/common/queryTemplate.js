module.exports = function(searchString) {
    return `
    PREFIX dbpedia: <http://dbpedia.org/ontology/>
    PREFIX yago: <http://dbpedia.org/class/yago/>

    SELECT DISTINCT ?city, ?name
    WHERE {
        ?city ?t ?type;
            rdfs:label ?name.
        OPTIONAL {?city dbo:populationTotal ?population }.
        FILTER (?type IN (dbo:City, yago:City108524735))
        FILTER (LANG(?name) = "en")
        FILTER regex(?name, "^${searchString}", "i")
    }
    ORDER BY DESC(?population)

     LIMIT 5`
}