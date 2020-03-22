const userController = {
    profilePage : (req, res) => {

        if (!res.locals.user) {
            return res.redirect("/");
        }

        res.render("profile",{
            user: res.locals.user,
        });
        
    },

    adminPage: (req, res) => {

        res.render("admin",{
            user: res.locals.user,
        });
    },
}

module.exports = userController ;