const checkAdmin = (req, res, next) => {


    if (res.locals.user.role !== "admin") {
        return res.redirect("/");
    }
    
    next(); 
}

module.exports = checkAdmin ;