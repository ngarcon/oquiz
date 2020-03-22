const { Tag } = require('../models');

const TagController = {

    showTags: async (req, res) => {

        try {

            const tags = await Tag.findAll({
                order: ['name']
            });

            res.render('tags', {
                tags
            });   
                     
        } catch (error) {
            console.trace(error);
        }
        
    },

    showQuizzesByTag: async (req, res, next) => {

        try {
            const tagId = req.params.id;

            const [tag, tags] = await Promise.all([
                Tag.findByPk(tagId, {
                    include: [
                        {
                            association: "quizzes",
                            include: ["author", "tags"]
                        }
                    ]
                }), 
                Tag.findAll({
                    order: ['name']
                })

            ]);


            if (tag) {
                res.render('index', {
                    quizzes: tag.quizzes,
                    tags 
                }); 
            }
            
        } catch (error) {
            console.trace(error);
            res.status(500); 
                next();
        }
        
    },

};

module.exports= TagController;