function renderFavoriteLocations() {

    //1.Get the logged user if such - we need it for the template
    let currentUser = userStorage.getLoggedUser();

    //2.Create the context object for the template
    let context = {
        user: currentUser,
        isLogged: Boolean(currentUser),
        username: currentUser.username
    };

    //3.Fetch the main template and its partials
    Promise.all([getTemplate("./assets/templates/favoriteLocations.hbs"), getTemplate("./assets/templates/header.hbs"), getTemplate("./assets/templates/country.hbs")])
        .then(([favLocationsSource, headerSource, countrySource]) => {

            Handlebars.registerPartial('header', headerSource);
            Handlebars.registerPartial('country', countrySource);

            let favLocationsHeaderPartialCountryPartial = Handlebars.compile(favLocationsSource);

            //4.създаваме масив от "висящи" fetchove за всяка една държава, която е в любими на текущо логнатия юзър
            Promise.all(currentUser.favorites.map(countryName => genericFetch(`https://restcountries.com/v3.1/name/${countryName}`)))
                .then(data => {
                    console.log(data);

                    context.countries = data.flat().map(country => {
                        if (currentUser.favorites.includes(country.name.common)) {
                            country.isLiked = true;
                        } else {
                            country.isLiked = false;
                        }

                        return country;
                    });

                    let resultHtml = favLocationsHeaderPartialCountryPartial(context);
                    container.innerHTML = resultHtml;


                }).catch(err => {
                    let cardsEl = document.getElementById("cardsEl");
                    cardsEl.innerHTML = `<h1>${err.message}</h1>`
                })

        });


}