import express from 'express';
import { handleLogin } from "../handlers/login.js";
import { checkUserRoleBeforeLogin } from '../middlewares/checkUserRoleBeforeLogin.js';
const router = express.Router();

//One to render the form where users can input their details
router.get('/', (req, res) => {
  if (req.session.isLoggined) {
    res.render('index', { username: req.session.username, isLoggined: true, userRole: req.session.role });
  } else {
    res.render('login', { username: '', isLoggined: false, userRole: '' });
  }
});

router.get('/login', (req, res) => {
  if (req.session.isLoggined) {
    res.render('index', { username: req.session.username, isLoggined: true, userRole: req.session.role });
  } else {
    res.render('login', { username: '', isLoggined: false, userRole: '' });
  }
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/login', checkUserRoleBeforeLogin, handleLogin);

router.get('/logout', (req, res) => {
  if (req.session.isLoggined) {
    req.session.destroy(err => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Could not log out, please try again.");
      }
      // clear all cookie token on client browers
      res.clearCookie("token");
      res.redirect('/login');
    });
  }
});



export default router;
