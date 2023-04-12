const axios = require('axios')
const logger = require('../utils/logger')

/*
 * This file contains functions that fetch artist data from Wikipedia.
 */

// I put the unused code in comment jail so it won't mess anything up but it might be useful later? -Luuranko

// let artist = 'The Beatles' // Example. Should work for most artists.
// let url = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=' + artist + '&rvsection=0'

//Fetches artist's genre using WikiMedia Action API
// axios
//     .get(url)
//     .then(({ data }) => {
//         let key = Object.keys(data.query.pages)
//         infobox = data.query.pages[key].revisions[0]["*"]

//         let genres = infobox.match(/genre([\s\S]*?)\]/)[0]

//         let genre = genres.substring(
//             genres.indexOf('[') + 2, genres.indexOf(']')
//         ).toLowerCase().split('|')[0]

//     })

//Alternative approach: Fetches artist's genre(s) from Wikidata

// Dispatches SPARQL query to Wikidata Query Service, response in json format
class SPARQLQueryDispatcher {
  constructor(endpoint) {
    this.endpoint = endpoint
  }

  query(sparqlQuery) {
    const fullUrl = this.endpoint + '?query=' + encodeURIComponent(sparqlQuery)

    return axios
      .get(fullUrl, {
        headers: {
          Accept: 'application/sparql-results+json'
        }
      })
      .then((response) => {
        return response.data.results.bindings
      })
  }
}

// Fetch Wikidata ID for a given artist (returns the ID of the first result so not very sophisticated atm)
const getArtistID = async (artist) => {

  let url = 'https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&type=item&continue=0&search=' + artist

  try {
    const response = await axios.get(url)
    // Gets the artist's name from the user, so could be undefined if the user makes a typo
    if (response.data.search[0] !== undefined) {
      return response.data.search[0].id
    } else {
      return false
    }
  } catch (error) {
    logger.error(error)
  }
}


// Get Wikidata ID for a given artist, create a query dispatcher, query db for associated genres, list genres
// Artist = the message sent by the user, if it's "other"-category
const getGenre = async (artist) => {
  const failedMessage = 'Could not find information on this band.'
  const artistID = await getArtistID(artist)
  if (!artistID) {
    return failedMessage
  }
  const endpointUrl = 'https://query.wikidata.org/sparql'
  const sparqlQuery = `SELECT ?genre ?genreLabel WHERE {
    wd:${artistID} wdt:P136 ?genre.
    SERVICE wikibase:label {
      bd:serviceParam wikibase:language "en" .
    }
  }`

  const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl)
  const genres = await queryDispatcher.query(sparqlQuery)

  // In case of typos
  if (genres[0] !== undefined) {
    return genres[0].genreLabel.value
  } else {
    return failedMessage
  }
}

module.exports = { getGenre }
