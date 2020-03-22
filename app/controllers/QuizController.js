const { Quiz, Tag } = require("../models"); 

const QuizController = {

    /*
        quiz
            -> nom du quiz
            -> auteur
            -> nombre de questions
            -> tags associés (sujets)

        question 
            -> 4 réponses
            -> niveau
            -> anecdotes
            -> wiki


    */
   showQuiz: async (req, res, next) => {
        try {

            const quizId = req.params.id;

            const quiz = await Quiz.findByPk(quizId, {
                include: [
                    "author",
                    "tags",
                    {
                        association: "questions",
                        include: ["level", "answers", "good_answer"]
                    }
                ], 
        
            });

            if (! quiz) {
                // si on a pas trouvé le quiz, on passe à next (qui est en fait la page 404 !)
                return next();
            }

           

            const quizPage = (res.locals.user) ? "play_quiz" : "quiz"; 

            res.render(quizPage, {  
                quiz
            });
    
            
            
        } catch (error) {
            res.status(500);
            next(); 
        }

   },

   quizAction: async (req,res, next) => {
        try {
        //récupérer le quiz avec l'id fourni
            const quizId = req.params.id;

            //récupérer les réponses de l'utilisateur 
            const userAnswers = req.body; 

            const parsedUserAnswers = {}; 

            
            for (const prop in userAnswers) {
                parsedUserAnswers[parseInt(prop, 10)] = userAnswers[prop]; 
            }

            console.log("userAnswers", userAnswers);

            const quiz = await Quiz.findByPk(quizId, {
            include: [
                "author", 
                {
                association: "questions",
                include: ["level", "good_answer", "answers"]
                },
                "tags"
            ]
            });

            const tags = await Tag.findAll(); 

            if (!quiz) {
                return next();
            }
            
            //comparer chaque valeur fournis au valeurs enregistrées
            

            quiz.score = 0; 

            for (const question of quiz.questions) {
                question.results = {};
                question.results.userIsRight = false;

                // L'utilisateur a-t-il répondu à la question courante
                if (userAnswers.hasOwnProperty(question.id)) {
                

                // si oui charge sa réponse dans un objet
                question.results.userAnswer = userAnswers[question.id];
                question.results.goodAnswer = question.good_answer.description;

                /*
                userAnswers[question.id].answer = userAnswers[question.id];
                console.log("AnsweredQuestion", userAnswers[question.id]); 
                console.log("Right answer", answerByQuestionsId[question.id].goodAnswer );
                */

                // la réponse de l'utilisateur, est-elle la même que la bonne réponse associé à la question courante
                if (question.results.userAnswer === question.results.goodAnswer) {
                    
                    // si oui on rajoute une propriété "isUserRight" de valeur true 
                    question.results.userIsRight = true; 
                    quiz.score++;
                    console.log(quiz.score);
                    //answerByQuestionsId[question.id]

                } // fin de if 
                } // fin de if 

            } // fin de for 

            res.render("quiz_results", { 
                quiz,
                tags, 
            });
            
            } 
        
        catch (error) {
            console.trace(error);
        }

    }
}

module.exports = QuizController ;