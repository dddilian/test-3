(function () {

    //!Listeners
    window.addEventListener("load", (e) => {
        if (localStorage.getItem("currentUser")) {
            location.hash = "#home";
            renderHome();
        } else { //Когато се отвори приложението, ако потребителя не е логнат, трябва да се прехвърли към LOGIN страницата
            renderLogin();
            location.hash = "#login";
        }
    });

    window.addEventListener("hashchange", hashRouter)

    //!hash router
    function hashRouter() {

        if (location.hash == "") {
            location.hash = "#home";
        }

        let hashComponentsArr = location.hash.split("/");
        let hash = hashComponentsArr[0].slice(1);

        // let hash = location.hash.slice(1);
        console.log(hash);

        switch (hash) {

            case "login":
                renderLogin();
                break;

            case "register":
                renderRegister();
                break;

            case "home":
                if (localStorage.getItem("currentUser")) {
                    renderHome();
                } else {
                    location.hash = "#login"
                }
                break;

            case "favoriteLocations":
                renderFavoriteLocations();
                break;

            case "forecast":
                let countryName = hashComponentsArr[1]
                renderForecast(countryName);
                break;

            case "logout":
                userStorage.logout();
                location.hash = "#login"
                break;

            default:
                renderError();
                break;

        }
    }

})();