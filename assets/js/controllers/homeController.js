function renderHome() {

    //1.Get the logged user if such - we need it for the template
    let currentUser = userStorage.getLoggedUser();
    let allCountries = []; //!оригинално това е закоментирано - това го ползвам, за да филтрирам от него държави при search, а не да правя заявките връщат тъпи предложения за държави

    //2.Create the context object for the template
    let context = {
        user: currentUser,
        isLogged: Boolean(currentUser),
        username: currentUser.username
    };

    //3.Fetch the main template and its partials
    Promise.all([
            getTemplate("./assets/templates/home.hbs"),
            getTemplate("./assets/templates/header.hbs"),
            getTemplate("./assets/templates/country.hbs")
        ])
        .then(([homeSource, headerSource, countrySource]) => {

            //4.Register the partials 
            Handlebars.registerPartial('header', headerSource);
            Handlebars.registerPartial('country', countrySource);

            //5.Compile template with partials
            let homePlusHeaderPartialPlusCountryPartial = Handlebars.compile(homeSource);

            //6.Fetch all countries
            genericFetch('https://restcountries.com/v3.1/all')
                .then(data => {

                    //7.Add the countries to the context, but first add to each one if is liked or not - for that we need the current logged user and his array with liked countries
                    context.countries = data.map(country => {
                        if (currentUser.favorites.includes(country.name.common)) {
                            country.isLiked = true;
                        } else {
                            country.isLiked = false;
                        }
                        return country;
                    });

                    //! оригинално това е закоментирано - в случая го ползваме, за да търсим държави в него, а не да пращаме заявка при всеки инпут в search
                    //! Така search ф-ята връща по-нормални резултати, отколкото връщаните от API-то
                    allCountries = context.countries;

                    //8.Generate the html with the context object and append it the the container element
                    let resultHtml = homePlusHeaderPartialPlusCountryPartial(context);
                    container.innerHTML = resultHtml;

                    //9.Create listener за input в search полето
                    let searchEl = document.getElementById("searchEl");
                    searchEl.addEventListener("input", debouncedSearch);

                })
                .catch(err => {
                    container.innerHTML = err.message;
                })
        });

    //!======================================
    //! оригинално това е закоментирано, защото изискването в задачата е да се search-ва чрез заявки към API-то
    //! В оригиналният вариант тези функции не се намират тук, а в util.js правят заявка при search,
    //! докато тук филтрират съществуващ масив с всички държави (allCountries), които така или иначе зареждаме всеки път, когато отваряме home страницата, което пак е тъпо
    //! Не виждам смисъл да се правят search заявки всеки път, и то при положение, че като напишеш примерно bul, не връща само държави съдържащи bul в името си, а всякакви странни предложения
    function searchCountries() {

        let str = searchEl.value;
        let cardsEl = document.getElementById("cardsEl");
        cardsEl.innerHTML = "";

        //!Не ме кефи начинът, по който се търсят държави по въведен частичен стринг. Излизат всякакви глупости, като response
        //!По-добре да се свалят веднъж всички държави в масив, и вече в него да се търси и от него да се филтрира със startsWith(str)
        getTemplate("./assets/templates/country.hbs")
            .then((templateSource) => {

                let countryTemplate = Handlebars.compile(templateSource);
                let countriesHtml = "";

                //!Логиката за търсене - ако името на държавата започва с написаните букви - покажи я. 
                let filteredCountries = allCountries.filter(country => country.name.common.toLowerCase().startsWith(str.toLowerCase()));

                filteredCountries.forEach(country => {
                    console.log(country);
                    countriesHtml += countryTemplate(country);
                })

                cardsEl.innerHTML = countriesHtml;
            })

    }

    function debounce(funcToDebounce, time) {
        let timerId;
        return function () {
            clearInterval(timerId);
            timerId = setTimeout(funcToDebounce, time);
        }
    };

    let debouncedSearch = debounce(searchCountries, 500);

    //!=============================

};