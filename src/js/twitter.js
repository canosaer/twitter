class TwitterAPI {
    //same as http://localhost:8888/twitter-api/twitter-proxy.ph
    API_BASE_URL = `./twitter-proxy.php`

    constructor() {
        this.termInput = document.querySelector(`.search-controls__input`)
        this.sortButton = document.querySelector(`.sort-menu__active`)
        this.firstSortOpen = true
        this.sortList = document.querySelector(`.sort-menu__list`)
        this.sortText = document.querySelector(`.sort-menu__text`)
        this.countButton = document.querySelector(`.count-menu__active`)
        this.countList = document.querySelector(`.count-menu__list`)
        this.countText = document.querySelector(`.count-menu__text`)
        this.firstCountOpen = true

        this.setupListeners()
    }

    setupListeners() {
        const searchButton = document.querySelector(`.search-controls__button`)

        this.termInput.addEventListener(`keyup`, this.checkForEnter)
        searchButton.addEventListener(`click`, this.handleSearch)
        this.sortButton.addEventListener(`click`, this.handleSortClick)
        this.countButton.addEventListener(`click`, this.handleCountClick)
    }

    handleSearch = (evt) => {
        const query = document.querySelector(`.search-controls__input`).value

        console.log(query)

        const data = {
            op: `search_tweets`,
            q: query,
            result_type: `recent`,
            count: 20,
        }


        axios.get(this.API_BASE_URL, { params: data }).then(this.processResults)
        // .catch(this.handleError)
    }

    processResults = (data) => {
        // const results = data.data
        let results = JSON.parse(data.data.substring(38,data.data.length))

        console.log(results)

    }

    handleError = (evt) => {
        console.error(`ERROR!`, err)
    }

    checkForEnter = (evt) => {
        if(evt.key === `Enter`) this.handleSearch()
    }

    handleSortClick = (evt) => {
        this.sortList.classList.toggle(`hidden`)
        if(this.firstSortOpen){
            let sortMenuItems = document.querySelectorAll(`.sort-menu__item`)
            this.firstSortOpen = false
            sortMenuItems.forEach(item => {
                item.addEventListener(`click`, this.handleSortItemClick)
            });
        }
    }

    handleSortItemClick = (evt) => {
        if(this.sortText.textContent != evt.target.textContent){
            this.sortText.textContent = evt.target.textContent
            if(document.querySelector(`.results__row`)){
                this.handleSearch()
            }
        }
        this.sortList.classList.toggle(`hidden`)
    }

    handleCountClick = (evt) => {

        this.countList.classList.toggle(`hidden`)
        if(this.firstCountOpen){
            let countMenuItems = document.querySelectorAll(`.count-menu__item`)
            this.firstCountOpen = false
            countMenuItems.forEach(item => {
                item.addEventListener(`click`, this.handleCountItemClick)
            });
        }
    }

    handleCountItemClick = (evt) => {
        if(this.countText.textContent != evt.target.textContent){
            this.countText.textContent = evt.target.textContent
            if(this.termInput.value){
                this.handleSearch()
            }
        }
        this.countList.classList.toggle(`hidden`)
    }

}