const express = require('express');
const router = express.Router(); 
const mainController = require('./controllers/mainController');
const authController = require('./controllers/authController');
const QuizController = require('./controllers/QuizController');
const TagController = require('./controllers/TagController');
const userController = require('./controllers/userController');

const adminMiddleware = require('./middlewares/checkAdmin'); 

router.get("/", mainController.homePage); 

router.route("/signup") 
    .get(authController.signupPage)
    .post(authController.signupAction); 

router.route("/login") 
    .get(authController.loginPage)
    .post(authController.loginAction); 

router.route("/quiz/:id")
    .get(QuizController.showQuiz)
    .post(QuizController.quizAction); 

//router.get('/tags', TagController.showTags);
router.get('/tags/:id', TagController.showQuizzesByTag);

router.get("/admin", adminMiddleware, userController.adminPage); 

router.get("/profile", userController.profilePage); 

router.get("/logout", authController.logout);

router.use(mainController.notFound); 

module.exports = router;