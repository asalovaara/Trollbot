const axios = require('axios')
// let bandname = 'Porcupine Tree' // Example. Should work for most bands.
//Fetches the band's genre using Wikipedia API
const url1 = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles='
const url2 = '&rvsection=0'

// const getQuery = (bandname) => {
//     let url = url1 + bandname + url2
//     axios.get(url).then(res => {
//         return res.data
//     })
//     // .then(res => {
//     //     return res.data
//     // })
//     // .then(data => {
//     //     console.log(data)
//     //     return data.query.pages[Object.keys(data.query.pages)].revisions[0]["*"]
//     // })
//     // .then(infobox => {
//     //     console.log(infobox)
//     //     return infobox.match(/genre([\s\S]*?)\]/)[0]
//     // })
// }

const getGenre = (bandname) => {
    let url = url1 + bandname + url2
    genre = async function(url) {
        await axios
        .get(url)
        .then(({ data }) => {
            let key = Object.keys(data.query.pages)
            infobox = data.query.pages[key].revisions[0]["*"]

            let genres = infobox.match(/genre([\s\S]*?)\]/)[0]

            let genre = genres.substring(
                genres.indexOf('[') + 2, genres.indexOf(']')
            ).toLowerCase().split('|')[0]

            console.log(genre)
            return genre
        })
    }
    return genre(url)
}

module.exports = getGenre


