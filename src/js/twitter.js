class TwitterAPI {
    //same as http://localhost:8888/twitter-api/twitter-proxy.ph
    API_BASE_URL = `./twitter-proxy.php`

    constructor() {

        this.setupListener()
    }

    setupListener() {
        const searchButton = document.querySelector(`.search-controls__button`)

        searchButton.addEventListener(`click`, this.handleSearch)
    }

    handleSearch = (evt) => {
        const query = document.querySelector(`.search-controls__input_term`).value

        console.log(query)

        const data = {
            op: `search_tweets`,
            q: query,
        }


        axios.get(this.API_BASE_URL, { params: data }).then(this.processResults)
        // .catch(this.handleError)
    }

    processResults = (data) => {
        // const results = data.data
        let preprosResults = JSON.parse(data.data.substring(38,data.data.length))

        console.log(preprosResults)

    }

    handleError = (evt) => {
        console.error(`ERROR!`, err)
    }

}