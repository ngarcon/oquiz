const { Quiz, Tag } = require("../models"); 

const mainController = {

    homePage: async (req, res) => { 

        try {

            const [quizzes, tags] = await Promise.all([
                Quiz.findAll({
                    include: ["author", "tags"], 
                }), 
                Tag.findAll({
                    order: ['name']
                })
            ]);

            res.render("index", {
                quizzes,
                tags, 
            }); 
            
        } catch (error) {
            console.trace(error);
            res.status(500).render('500', {
                error
            });
        }    

    },

    notFound: (req, res) => {
        res.status(500).render('404'); 
    },

}

module.exports = mainController ;