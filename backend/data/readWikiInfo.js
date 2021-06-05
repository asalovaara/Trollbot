const axios = require('axios')

let bandname = 'Porcupine Tree' // Example. Should work for most bands.
let url = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=' + bandname + '&rvsection=0'

//Fetches the band's genre using Wikipedia API
axios
    .get(url)
    .then(({ data }) => {
        let key = Object.keys(data.query.pages)
        infobox = data.query.pages[key].revisions[0]["*"]

        let genres = infobox.match(/genre([\s\S]*?)\]/)[0]

        let genre = genres.substring(
            genres.indexOf('[') + 2, genres.indexOf(']')
        ).toLowerCase().split('|')[0]

        console.log(genre)

    })