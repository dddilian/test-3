let userStorage = (function () {

    class User {
        constructor(username, password) {
            this.username = username;
            this.password = password;
            this.favorites = [];
        }

    }

    class UserStorage {

        constructor() {

            let currentUsers = localStorage.getItem("users");

            if (!currentUsers) { //ако в localStorage няма юзъри, сетни някакви дефолтни
                let defaultUsers = [
                    new User("Pesho", "123"),
                    new User("Gosho", "123"),
                ]
                localStorage.setItem("users", JSON.stringify(defaultUsers));
            }

            this.users = JSON.parse(localStorage.getItem("users")); //вземи юзърите от localStorage и ги запиши в this.users

        }

        register(username, password) {
            if (!this.userExists(username)) { //ако не същетвува - създай такъв юзър
                let newUser = new User(username, password);
                this.users.push(newUser); //сложи го в this.users
                localStorage.setItem("users", JSON.stringify(this.users)); //и веднага ъпдейтни юзърите в "базата данни"
                return true;
            } else {
                return false;
            }

        }

        login(username, password) {

            if (this.userExists(username)) { //ако юзъра съществува
                let userToLogin = this.getUser(username);

                if (userToLogin.password === password) { //и ако си е написал паролата правилно
                    localStorage.setItem("currentUser", JSON.stringify(userToLogin));
                    console.log("Login successful");
                    return true;
                } else { //ако има такъв юзър, но паролата е грешна
                    console.log("Wrong password");
                    return false;
                }

            } else { //изобщо няма такъв юзър
                console.log("User not registered");
                return false;
            }

        }

        logout() {
            localStorage.setItem("users", JSON.stringify(this.users));
            localStorage.removeItem("currentUser");
        }

        userExists(username) {
            return this.users.some(user => user.username === username); //returns true or false
        }

        getUser(username) {
            return this.users.find(user => user.username === username);
        }

        getLoggedUser() {
            return JSON.parse(localStorage.getItem("currentUser"));
        }

        updateUser(updatedUser) {
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        }

    }

    return new UserStorage();

})();