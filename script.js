const resultNav = document.querySelector('#resultNav')
const favoritesNav = document.querySelector('#favoritesNav')
const imagesContainer = document.querySelector('.images-container')
const saveConfirmed = document.querySelector('.save-confirmed')
const loader = document.querySelector('.loader')
const loading = document.querySelector('.loader2')



// NASA API
const count = 10;
const apiKey = 'X3jyYo6Cflp7gghi0x6UDa2EvK9lYgTdzLuNDQRv'
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

let resultsArray = []
let favorites = {}

function showContent(page) {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (page === 'results') {
        resultsNav.classList.remove('hidden')
        favoritesNav.classList.add('hidden')
    } else {
        resultsNav.classList.add('hidden')
        favoritesNav.classList.remove('hidden')
    }
    loader.classList.add('hidden')
}


function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites)

    currentArray.forEach(result => {
        // card container
        const card = document.createElement('div')
        card.classList.add('card')
        // link 
        const link = document.createElement('a')
        link.href = result.hdurl
        link.title = 'View Full Image'
        link.target = '_blank'
        // image
        const image = document.createElement('img')
        image.src = result.url
        image.alt = result.title
        image.loading = 'lazy'
        image.classList.add('card-img-top')
        // card body
        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')
        // card title
        const cardTitle = document.createElement('h5')
        cardTitle.classList.add('card-title')
        cardTitle.textContent = result.title
        // save text
        const saveText = document.createElement('p')
        saveText.classList.add('clickable')

        if (page === 'results') {
            saveText.classList.add('clickable', 'cta')

            saveText.textContent = '💙 Add To Favorites'
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`)

        } else {
            saveText.classList.add('clickable', 'cta', 'danger')
            saveText.textContent = '🔴 Remove Favorite'
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`)
        }
        // card text
        const cardText = document.createElement('p')
        cardText.textContent = result.explanation
        // footer container
        const footer = document.createElement('small')
        footer.classList.add('text-muted')
        // date
        const date = document.createElement('strong')
        date.textContent = result.date
        // copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright
        const copyright = document.createElement('span')
        copyright.textContent = ` ${copyrightResult} `

        // append
        footer.append(date, copyright)
        cardBody.append(cardTitle, cardText, footer, saveText)
        link.appendChild(image)
        card.append(link, cardBody)
        imagesContainer.appendChild(card)
    })
}

function updateDOM(page) {
    //  get favorites from local storage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'))
    }
    imagesContainer.textContent = ''
    createDOMNodes(page)
    showContent(page)

}

// get 10 images from nasa api
async function getNasaPictures(counter) {
    // show loader
    // saya merubah ini
    // loader.classList.remove('hidden')

    try {
        // const response = await fetch(apiUrl)
        // saya merubah ini
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${counter}`)
        resultsArray = await response.json()
        console.log(resultsArray)
        updateDOM('results')
        // updateDOM('favorites')
    } catch (error) {
        console.log(error)
    }
}
// add result to favorites
function saveFavorite(itemUrl) {
    // loop through array to select favorite
    resultsArray.forEach(item => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item
            console.log(favorites)
            // show save confirmation
            saveConfirmed.hidden = false
            setTimeout(() => {
                saveConfirmed.hidden = true
            }, 2000);
            // set favorites in local storage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
        }
    })
}
// remove from favorite
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl]
        saveConfirmed.hidden = false
        // adding some feauture of notifications
        saveConfirmed.textContent = 'Removed!'
        saveConfirmed.classList.add('danger')
        setTimeout(() => {
            saveConfirmed.hidden = true
        }, 2000);
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
        updateDOM('favorites')
    }
}
function showLoading() {
    loading.classList.add('show')
    setTimeout(() => {
        loading.classList.remove('show')

        setTimeout(() => {
            const counter = count++
            // saya merubah ini
            getNasaPictures(counter)
        }, 300)
    }, 1000)
}

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
        showLoading()

    }
})

// on load
getNasaPictures()