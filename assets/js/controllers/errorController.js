function renderError() {
    let currentUser = userStorage.getLoggedUser();
    let context = {
        user: currentUser,
        isLogged: Boolean(currentUser),
        username: currentUser.username
    };

    Promise.all([getTemplate("./assets/templates/error.hbs"), getTemplate("./assets/templates/header.hbs")])
        .then(([errorTemplateSource, headerPartialSource]) => {

            Handlebars.registerPartial('header', headerPartialSource); //header в кавички трябва да е изписано, точно както е изписано в темплейта за error

            let errorTemplate = Handlebars.compile(errorTemplateSource);
            let resultHtml = errorTemplate(context);
            container.innerHTML = resultHtml;

        })

}