class YelpAPI{
    API_KEY = `lNOHlGv2bXagcb0hx8e0p43SN3ApkVZSWxcCvatw-iBai9cBWij0XtCUnwXSzUcPni7SClAvrRx15FeGSUZwNGg0iQ-Z3g9jEzkDfHoyNN09LvchfqrdpaF6VMx9YHYx`
    API_BASE_URL = `https://circuslabs.net/proxies/yelp-fusion-proxy/`

    constructor() {
        this.termInput = document.querySelector(`.search-controls__input_term`)
        this.locationInput = document.querySelector(`.search-controls__input_location`)
        this.priceFilter = false
        this.menuButton = document.querySelector(`.search-menu__active`)
        this.firstMenuOpen = true
        this.sortList = document.querySelector(`.search-menu__sort-list`)
        this.sortText = document.querySelector(`.search-menu__text`)
        this.radiusButton = document.querySelector(`.radius-menu__active`)
        this.radiusList = document.querySelector(`.radius-menu__list`)
        this.radiusText = document.querySelector(`.radius-menu__text`)
        this.firstRadiusOpen = true

        this.setupListener()
    }

    setupListener() {
        const searchButton = document.querySelector(`.search-controls__button`)
        const priceRangeButton = document.querySelector(`.price-range__toggle`)

        searchButton.addEventListener(`click`, this.handleSearch)
        this.locationInput.addEventListener(`keyup`, this.checkForEnter)
        this.termInput.addEventListener(`keyup`, this.checkForEnter)
        priceRangeButton.addEventListener(`click`, this.handlePriceRangeClick)
        this.menuButton.addEventListener(`click`, this.handleMenuClick)
        this.radiusButton.addEventListener(`click`, this.handleRadiusClick)
    }

    handleSearch = (evt) => {
        const term = document.querySelector(`.search-controls__input_term`).value

        let location = document.querySelector(`.search-controls__input_location`).value
        if(!location) location = `Atlanta, GA`

        let selectedSort = `best_match`
        if(this.sortText.textContent.indexOf(`Rating`) !== -1) selectedSort = `rating`
        else if(this.sortText.textContent.indexOf(`Reviews`) !== -1) selectedSort = `review_count`
        else if(this.sortText.textContent.indexOf(`Distance`) !== -1) selectedSort = `distance`

        const distance = parseInt(this.radiusText.textContent.substring(0,2).trim()) * 800
        console.log(distance)

        const openNow = document.querySelector(`.open-now__checkbox`).checked

        let priceString = ``
        const priceChecks = document.querySelectorAll(`.price-range__checkbox`)
        for(let i=0;i<4;i++){
            if (priceChecks[i].checked) priceString += `${i+1}, `
        }
        if(priceString === `` || this.priceFilter===false) priceString = `1, 2, 3, 4, `
        priceString = this.removeLastComma(priceString)

        const data = {
            _ep: `/businesses/search`,
            term: term,
            location: location,
            sort_by: selectedSort,
            radius: distance,
            open_now: openNow,
            price: priceString,
        }

        const headers = {
            Authorization: `Bearer ${this.API_KEY}`
        }

        axios.get(this.API_BASE_URL, { params: data, headers: headers }).then(this.processResults)
    }

    removeLastComma = (string) => {
        return string.slice(0, string.length-2)
    }

    processResults = (data) => {
        const results = data.data.businesses
        const resultsSection = document.querySelector(`.results`)
        const oldContent = resultsSection.querySelectorAll(`*`)
        if(oldContent){
            oldContent.forEach(element => {
                element.remove()
            })
        }
        console.log(results)
        results.forEach(business => {
            let resultRow = document.createElement(`div`)
            resultRow.classList.add(`results__row`)

            let photoAnchor = document.createElement(`a`)
            photoAnchor.classList.add(`results__photo`)
            photoAnchor.style.background = `url(${business.image_url})`
            photoAnchor.style.backgroundSize = `cover`
            photoAnchor.style.backgroundPoisition = `center`
            resultRow.appendChild(photoAnchor)
            photoAnchor.href = business.url
            photoAnchor.setAttribute(`target`, `_blank`)

            let nameAnchor = document.createElement(`a`)
            nameAnchor.href = business.url
            nameAnchor.setAttribute(`target`, `_blank`)
            nameAnchor.classList.add(`results__name`)
            nameAnchor.textContent = business.name
            resultRow.appendChild(nameAnchor)

            let ratingRow = document.createElement(`div`)
            ratingRow.classList.add(`results__rating-row`)
            
            let ratingSpan = document.createElement(`span`)
            ratingSpan.classList.add(`results__rating`)
            ratingSpan.textContent = `${business.rating} stars `
            ratingRow.appendChild(ratingSpan)

            let reviewsSpan = document.createElement(`span`)
            reviewsSpan.classList.add(`results__reviews`)
            reviewsSpan.textContent = `(${business.review_count} reviews)`
            ratingRow.appendChild(reviewsSpan)

            resultRow.appendChild(ratingRow)

            let infoRow = document.createElement(`div`)
            infoRow.classList.add(`results__info-row`)

            let priceSpan = document.createElement(`span`)
            priceSpan.classList.add(`results__price`)
            priceSpan.textContent = `${business.price} • `
            infoRow.appendChild(priceSpan)

            let categorySpan = document.createElement(`span`)
            let categoryString = ``
            categorySpan.classList.add(`results__category`)
            business.categories.forEach(category => {
                categoryString += `${category.title}, `
            });
            categoryString = this.removeLastComma(categoryString)
            categorySpan.textContent = `${categoryString}`
            infoRow.appendChild(categorySpan)

            if(business.transactions.length > 0){
                let transactionsSpan = document.createElement(`span`)
                let transactionsString = ` • `
                transactionsSpan.classList.add(`results__transactions`)
                business.transactions.forEach(transactionType => {
                    transactionsString += `${transactionType}, `
                });
                transactionsSpan.textContent = this.removeLastComma(transactionsString)
                transactionsSpan.style.textTransform = `capitalize`
                infoRow.appendChild(transactionsSpan)
            }

            resultRow.appendChild(infoRow)

            
            business.location.display_address.forEach(row => {
                let addressRow = document.createElement(`p`)
                addressRow.classList.add(`results__address-row`)
                addressRow.textContent = row
                resultRow.appendChild(addressRow)
            });

            resultsSection.appendChild(resultRow)

        });
    
    }

    checkForEnter = (evt) => {
        if(evt.key === `Enter`) this.handleSearch()
    }

    handleMenuClick = (evt) => {

        this.sortList.classList.toggle(`hidden`)
        if(this.firstMenuOpen){
            let sortMenuItems = document.querySelectorAll(`.search-menu__item`)
            this.firstMenuOpen = false
            sortMenuItems.forEach(item => {
                item.addEventListener(`click`, this.handleMenuItemClick)
            });
        }
    }

    handleMenuItemClick = (evt) => {
        if(this.sortText.textContent != evt.target.textContent){
            this.sortText.textContent = evt.target.textContent
            if(document.querySelector(`.results__row`)){
                this.handleSearch()
            }
        }
        this.sortList.classList.toggle(`hidden`)
    }

    handleRadiusClick = (evt) => {

        this.radiusList.classList.toggle(`hidden`)
        if(this.firstRadiusOpen){
            let radiusMenuItems = document.querySelectorAll(`.radius-menu__item`)
            this.firstRadiusOpen = false
            radiusMenuItems.forEach(item => {
                item.addEventListener(`click`, this.handleRadiusItemClick)
            });
        }
    }

    handleRadiusItemClick = (evt) => {
        if(this.radiusText.textContent != evt.target.textContent){
            this.radiusText.textContent = evt.target.textContent
            if(this.locationInput.value){
                this.handleSearch()
            }
        }
        this.radiusList.classList.toggle(`hidden`)
    }

    handlePriceRangeClick = (evt) => {
        const priceRangeSymbol = document.querySelector(`.price-range__symbol`)
        const priceRangeInput = document.querySelector(`.price-range__input`)

        if(priceRangeInput.classList.contains(`hidden`)){
            priceRangeInput.classList.remove(`hidden`)
            priceRangeSymbol.textContent = `< >`
            this.priceFilter = true
        }
        else {
            priceRangeInput.classList.add(`hidden`)
            priceRangeSymbol.textContent = `><`
            this.priceFilter = false
        }
    }
    
}
    