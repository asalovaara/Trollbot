const axios = require('axios')

let artist = 'The Beatles' // Example. Should work for most artists.
let url = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=' + artist + '&rvsection=0'

//Fetches artist's genre using WikiMedia Action API
axios
    .get(url)
    .then(({ data }) => {
        let key = Object.keys(data.query.pages)
        infobox = data.query.pages[key].revisions[0]["*"]

        let genres = infobox.match(/genre([\s\S]*?)\]/)[0]

        let genre = genres.substring(
            genres.indexOf('[') + 2, genres.indexOf(']')
        ).toLowerCase().split('|')[0]

        console.log('WikiMedia Action API (only first genre):\n\tArtist:', artist, '\n\tGenre: ',genre,'\n')

    })

//Alternative approach: Fetches artist's genre(s) from Wikidata

// Dispatches SPARQL query to Wikidata Query Service, response in json format
class SPARQLQueryDispatcher {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    query(sparqlQuery) {
        const fullUrl = this.endpoint + '?query=' + encodeURIComponent(sparqlQuery);

        return axios
            .get(fullUrl, {
                headers: {
                    Accept: 'application/sparql-results+json'
                }
            })
            .then((response) => {

                let genres = response.data.results.bindings
                return genres
                
            })
    }
}

// Fetch Wikidata ID for a given artist (returns the ID of the first result so not very sophisticated atm)
const getArtistID = async (artist) => {

    url = 'https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&type=item&continue=0&search=' + artist

    try {
        const response = await axios.get(url)
        return response.data.search[0].id
    } catch (error) {
        console.log(error)
    }
}


// Get Wikidata ID for a given artist, create a query dispatcher, query db for associated genres, list genres
const getGenre = async (artist) => {

    const artistID = await getArtistID(artist)
    const endpointUrl = 'https://query.wikidata.org/sparql';
    const sparqlQuery = `SELECT ?genre ?genreLabel WHERE {
   wd:${artistID} wdt:P136 ?genre.
   SERVICE wikibase:label {
     bd:serviceParam wikibase:language "en" .
   }
}`;

    const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
    const genres = await queryDispatcher.query(sparqlQuery)

    console.log('Wikidata (all genres): \n\tArtist:', artist, '\n\tGenres:')
    genres.forEach(gnr => console.log('\t\t', gnr.genreLabel.value))

}

getGenre(artist)





