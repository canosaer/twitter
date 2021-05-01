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
        if(query){
            let selectedSort = `mixed`
            if(this.sortText.textContent.indexOf(`Popularity`) !== -1) selectedSort = `popular`
            else if(this.sortText.textContent.indexOf(`Newest`) !== -1) selectedSort = `recent`

            const numResults = parseInt(this.countText.textContent.substring(0,3).trim())
            

            const data = {
                op: `search_tweets`,
                q: query,
                result_type: selectedSort,
                count: numResults,
            }


            axios.get(this.API_BASE_URL, { params: data }).then(this.processResults).catch(this.handleError)
        }
        
    }

    processResults = (data) => {
        // const results = data.data.statuses
        let results = JSON.parse(data.data.substring(38,data.data.length)).statuses
        console.log(results)

        const resultsSection = document.querySelector(`.results`)
        const oldContent = resultsSection.querySelectorAll(`*`)
        if(oldContent){
            oldContent.forEach(element => {
                element.remove()
            })
        }

        results.forEach(tweet => {
            let resultRow = document.createElement(`div`)
            resultRow.classList.add(`results__row`)

            let avatarDiv = document.createElement(`div`)
            avatarDiv.classList.add(`results__avatar`)
            avatarDiv.style.background = `url(${tweet.user.profile_image_url})`
            avatarDiv.style.backgroundSize = `cover`
            avatarDiv.style.backgroundPoisition = `center`
            resultRow.appendChild(avatarDiv)

            let nameP = document.createElement(`p`)
            nameP.classList.add(`results__user-name`)
            nameP.textContent = tweet.user.name
            resultRow.appendChild(nameP)

            let atRowP = document.createElement(`p`)
            atRowP.classList.add(`results__at-row`)
            atRowP.textContent = `@`
            
            let screenNameSpan = document.createElement(`span`)
            screenNameSpan.classList.add(`results__screen-name`)
            screenNameSpan.textContent = tweet.user.screen_name
            atRowP.appendChild(screenNameSpan)

            resultRow.appendChild(atRowP)

            let tweetP = document.createElement(`p`)
            tweetP.classList.add(`results__tweet`)
            let rawTweet = tweet.text
            let linkIndex = rawTweet.indexOf(`https://`)
            if(linkIndex !== -1){
                let tweetAnchor = document.createElement(`a`)
                tweetAnchor.href = rawTweet.substring(linkIndex, rawTweet.length)
                tweetAnchor.setAttribute(`target`, `_blank`)
                tweetAnchor.textContent = rawTweet.substring(linkIndex, rawTweet.length)
                tweetAnchor.style.color = `skyblue`
                tweetP.textContent = rawTweet.substring(0,linkIndex) + ` `
                tweetP.appendChild(tweetAnchor)
            }
            else tweetP.textContent = rawTweet
            resultRow.appendChild(tweetP)

            let timestampP = document.createElement(`p`)
            timestampP.classList.add(`results__timestamp`)
            timestampP.textContent = this.formatTimestamp(tweet.created_at)
            resultRow.appendChild(timestampP)

            resultsSection.appendChild(resultRow)
        });

        

    }

    formatTimestamp = (rawTimestamp) => {
        let month = ``
        let inputMonth = rawTimestamp.substring(4,7)

        if(inputMonth === `Jan`) month = `1`
        else if(inputMonth === `Feb`) month = `2`
        else if(inputMonth === `Mar`) month = `3`
        else if(inputMonth === `Apr`) month = `4`
        else if(inputMonth === `May`) month = `5`
        else if(inputMonth === `Jun`) month = `6`
        else if(inputMonth === `Jul`) month = `7`
        else if(inputMonth === `Aug`) month = `8`
        else if(inputMonth === `Sep`) month = `9`
        else if(inputMonth === `Oct`) month = `10`
        else if(inputMonth === `Nov`) month = `11`
        else if(inputMonth === `Dec`) month = `12`

        let day = ``
        let rawDay = rawTimestamp.substring(8,10)
        if(rawDay[0] === `0`) day = rawDay[1]
        else day = rawDay

        let year = rawTimestamp.substring(28,30)
        
        return `${month}/${day}/${year}`
    }

    handleError = (evt) => {
        console.error(`ERROR!`, evt)
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