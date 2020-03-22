const { User } = require("../models"); 
const bcrypt = require('bcrypt');
const validator = require("email-validator"); 


const authController = {

    loginPage: (req, res) => {
        res.render("login");
    },

    loginAction: async (req, res) => {

        try {
            const {email, password} = req.body; 
            const user = await User.findOne({
                where: {
                    email
                }
            });

            if(!user) {
                return res.render("login", {
                    error: "Utilisateur inexistant",
                }); 
            }

            if(!bcrypt.compareSync(password, user.password)) {
                return res.render("login", {
                    error: "Le mot de passe ne correspond pas",
                }); 
            }

            req.session.user = user; 

            res.redirect("/"); 
            
        } catch (error) {
            console.trace(error);
        }
    },

    signupPage: (req, res) => {
        res.render("signup");
    },

    signupAction: async (req, res) => {

        console.log(req.body);
        try {

            const { firstname, lastname, email, passwordChoice, passwordConfirm } = req.body; 
        

            const user = await User.findOne({
                where: {
                    email: email,
                }
            }); 

            

            const errorList = [];

            if (user) {
                errorList.push("Cet email est déjà utilisé."); 
            }

            if (!validator.validate(email)) {
                console.log("if (!validator.validate(email))");
                errorList.push("Le format de l'email est invalide"); 
            }

            // nom et prénom non vide
            if (firstname === '' && lastname === '') {
                errorList.push("Vos nom et prénom ne peuvent être vides.");
            }

            // mot de passe min. 8 caractères
            if (passwordChoice.length < 8) {
                errorList.push("Votre mot de passe doit contenir au minimum 8 caractères");
            }
            
            // vérification de la correspondance des mots de passe
            if (passwordChoice !== passwordConfirm) {
                errorList.push("Vos mots de passe de correspondent pas.");
            }
            
            
            if(errorList.length === 0) {
                // SI ok 

                bcrypt.hash(passwordChoice, 10, (err, hash) => {
                    const newUser = new User({
                        firstname,
                        lastname,
                        email,
                        password: hash,
                    });

                    newUser.save();
                });

                req.session.user = user; 
                    
                    
                // rediriger vers index
                res.redirect("/");

                } else {
                    // SINON 
                    // rediriger vers signup 
                    console.table(errorList);
                    res.render("signup", {
                        errorList,
                    })
                }

        } catch (error) {
            console.trace(error);      
        }
       
    },     

    logout: (req, res) => {
        delete req.session.user; 
        res.redirect("/");
    }


}

module.exports = authController ;