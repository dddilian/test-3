function renderRegister() {

    Promise.all([getTemplate("./assets/templates/register.hbs"), getTemplate("./assets/templates/header.hbs")]) //пример с един главен темплейт и два partial-а вградени един в друг и после ползвани в главния темплейт
        .then(([registerSource, headerSource]) => {

            Handlebars.registerPartial('header', headerSource)

            let registerPlusHeaderPartial = Handlebars.compile(registerSource); //компилираме главния темплейт, който явно автоматично си вкарва "cat" където трябва

            let resultHtml = registerPlusHeaderPartial({});
            container.innerHTML = resultHtml;

            document.getElementById("regMeBtn").addEventListener("click", (e) => {
                e.preventDefault();

                let username = document.getElementById("regUsername").value.trim();
                let password = document.getElementById("regPassword1").value.trim();
                let rePassword = document.getElementById("regPassword2").value.trim();

                if (username !== "" && password !== "" && rePassword !== "") {

                    if (password === rePassword) {

                        if (userStorage.register(username, password)) {
                            renderLogin();
                            //displaySuccess(); //тази и долната ф-я, може да си ги сложим registerController.js, може в util.js.....
                        }

                    }

                } else {
                    //displayError();
                }


            });

        });
}