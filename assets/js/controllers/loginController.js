function renderLogin() {

    Promise.all([getTemplate("./assets/templates/login.hbs"), getTemplate("./assets/templates/header.hbs")]) //пример с един главен темплейт и два partial-а вградени един в друг и после ползвани в главния темплейт
        .then(([loginSource, headerSource]) => {

            Handlebars.registerPartial('header', headerSource)

            let loginPlusHeaderPartial = Handlebars.compile(loginSource); //компилираме главния темплейт, който явно автоматично си вкарва "cat" където трябва

            let resultHtml = loginPlusHeaderPartial({});
            container.innerHTML = resultHtml;

            document.getElementById("logMeBtn").addEventListener("click", (e) => {
                e.preventDefault();

                let username = document.getElementById("logUsername").value.trim();
                let password = document.getElementById("logPassword").value.trim();

                if (userStorage.login(username, password)) {
                    renderHome();
                } else {

                }

            });


        });

}