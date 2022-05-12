//!Get template
function getTemplate(templateLocation) {
    return fetch(templateLocation)
        .then(res => res.text()) //text!
};

//!Generic fetch
function genericFetch(url, options = {}) {
    return fetch(url, options)
        .then(res => {
            //ако статуса е в неуспешния диапазон - 4xx - 5xx, хвърли тази грешка, за да може после да се влезе в catch
            if (!res.ok) {
                throw new Error("Status code " + res.statusText);
            }
            return res.json();
        })
};


//!============================================= оригинално това е откоментирано
// function searchCountries() {

//     let str = searchEl.value;
//     let cardsEl = document.getElementById("cardsEl");
//     cardsEl.innerHTML = "";

//     //!Не ме кефи начинът, по който се търсят държави по въведен частичен стринг. Излизат всякакви глупости, като response
//     //!По-добре да се свалят веднъж всички държави в масив, и вече в него да се търси и от него да се филтрира със startsWith(str)
//     Promise.all([genericFetch(`https://restcountries.com/v3.1/name/${str}`), getTemplate("./assets/templates/country.hbs")])
//         .then(([countriesData, templateSource]) => {

//             let countryTemplate = Handlebars.compile(templateSource);
//             let countriesHtml = "";

//             countriesData.forEach(country => {
//                 console.log(country);
//                 countriesHtml += countryTemplate(country);
//             })

//             cardsEl.innerHTML = countriesHtml;
//         })

// }

// function debounce(funcToDebounce, time) {
//     let timerId;
//     return function () {
//         clearInterval(timerId);
//         timerId = setTimeout(funcToDebounce, time);
//     }
// };

// let debouncedSearch = debounce(searchCountries, 500);
//! ========================================================= 

//!Main container where everything renders
let container = document.getElementById("mainContainer");


//!Listener за добавяне в любими в/у целия контейнер с държави, вместо 250 отделни listener-а, прикрепени към всеки бутон за всяка държава
container.addEventListener("click", buttonClicked);

function buttonClicked(e) {

    //!ако натиснатия таргет е бутон, който в същото време има клас fav
    if (e.target.localName === "button" && Array.from(e.target.classList).includes("fav")) {
        let countryName = e.target.dataset.name;
        console.log(countryName);

        //1. вземи името на текущо логнатия потребтел 
        let currentLoggedUsername = userStorage.getLoggedUser().username;

        //2. по името го намери в "базата данни"
        let userInDatabase = userStorage.getUser(currentLoggedUsername);

        //3а. ако държавата не е в неговите любими - добави я
        if (!userInDatabase.favorites.includes(countryName)) {
            userInDatabase.favorites.push(countryName);
            e.target.textContent = "Remove from favorites";

        } else { //3б. ако държавата е в неговите любими - махни я

            //!Ако сме на страницата favoriteLocations, трябва и да разкараме елемента-card от DOM
            if (location.hash === "#favoriteLocations") {
                e.target.parentElement.parentElement.parentElement.remove();
            }
            // махаме страната от масива с любими в юзъра и променяме текста на бутончето
            userInDatabase.favorites.splice(userInDatabase.favorites.indexOf(countryName), 1);
            e.target.textContent = "Add to favorites";



        }

        //4. ъпдейтни текущо логнатия потребител - в localStorage (въпреки че няма смисъл,
        //тъй като винаги бъркаме в псевдо базата данни, за да проверяваме какво има или няма юзъра,
        //а от localStorage проверяваме само дали има логнат юзър, и после взимаме името му, за да го 
        //търсим в "базата данни", за да го модифицираме, за да се запазят промените, когато има logout
        userStorage.updateUser(userInDatabase);

    }

    // //! ако натиснатия таргет е бутон, който в същото време има клас forecast - вече е ненужно,
    // //! тъй като рендерирането на индивидуалната прогноза за държава става по друг начин - вече не става тук,
    // //! а в рутера чрез малка манипулация на локацията по hash
    // if (e.target.localName === "button" && Array.from(e.target.classList).includes("forecast")) {
    //     let countryName = e.target.dataset.name;
    //     renderForecast(countryName);
    // }


}