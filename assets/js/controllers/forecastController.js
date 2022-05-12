function renderForecast(countryName) {

    let currentUser = userStorage.getLoggedUser();

    genericFetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(countryData => {

            let country = countryData[0];
            let [latitude, longitude] = country.latlng;

            let context = {
                user: currentUser,
                isLogged: Boolean(currentUser),
                username: currentUser.username,
                countryName: country.name.common,
                countryFlagSrc: country.flags.png,
            }

            Promise.all([
                    genericFetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`),
                    getTemplate("./assets/templates/countryForecast.hbs"),
                    getTemplate("./assets/templates/header.hbs"),
                    getTemplate("./assets/templates/hour.hbs")
                ])
                .then(([forecast, mainTemplateSource, headerSource, hourSource]) => {

                    //console.log(forecast);
                    Handlebars.registerPartial('header', headerSource);
                    Handlebars.registerPartial('hour', hourSource);

                    let mainTemplatePlusHeaderPartialPlusHourPartial = Handlebars.compile(mainTemplateSource); //компилираме главния темплейт, който явно автоматично си вкарва "cat" където трябва

                    context.hours = forecast.properties.timeseries.slice(0, 6).map(period => {
                        // console.log(period);
                        return {
                            hour: new Date(period.time),
                            airTemp: period.data.instant.details.air_temperature,
                        }
                    });

                    // console.log(context);
                    let resultHtml = mainTemplatePlusHeaderPartialPlusHourPartial(context);
                    container.innerHTML = resultHtml;
                })

        })
};