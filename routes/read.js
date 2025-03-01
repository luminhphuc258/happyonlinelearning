import express from 'express';
import { fetchQuestions, fetchAllQuestions } from "../handlers/quiz.js";
import { quizAttempts } from "../handlers/userscore.js";
import CheackHeaderTokenMiddleware from "../middlewares/checkHeaderToken.js";
import { fetchAllUsers } from "../handlers/register.js";
import { fetchAllPrograms } from "../handlers/studyprogram.js";
import { fetchAllCourse } from "../handlers/courses.js";
// ==========================================ROUTER ZONE ============================================
const router = express.Router();

//============================================ USER AUTHENTICATION ===================================
router.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  req.session.emailtoken = tokens;
  // Store these tokens securely for sending emails later
});

//============================================ PROGRAM MANAGEMENT ====================================
router.get('/getallprograms', async (req, res) => {
  if (req.session.isLoggined) {
    try {
      const listdata = await fetchAllPrograms();
      console.log("===========here data return=========");
      console.log(listdata);

      // Pass the listusers array to the Handlebars view
      res.render('studyprogram', {
        username: req.session.username,
        isLoggined: true,
        userRole: req.session.role,
        fullName: req.session.fullname,
        email: req.session.email,
        useravatar: req.session.picture,
        returnlists: listdata
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).render('error', { error: 'Failed to fetch user data' });
    }
  } else {
    res.render('login', {
      username: '',
      isLoggined: false,
      userRole: '',
      fullName: '',
      email: '',
      useravatar: ''
    });
  }
});

//============================================ COURSE MANAGEMENT ====================================
router.get('/getprogramsforcourseform', async (req, res) => {
  if (req.session.isLoggined) {
    try {
      const listdata = await fetchAllPrograms();
      console.log("===========here data return=========");
      console.log(listdata);
      // Create an empty array to store the result
      let programArray = [];

      // Mapping through the data and pushing into the array
      listdata.forEach((program) => {
        programArray.push({
          program_id: program.program_id,
          program_name: program.program_name,
          description: program.description,
          total_credits: program.total_credits,
          is_active: program.is_active,
          start_date: program.start_date,
          end_date: program.end_date
        });
      });

      return res.status(200).json({ message: "success", ProgramLists: programArray });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.render('login', {
      username: '',
      isLoggined: false,
      userRole: '',
      fullName: '',
      email: '',
      useravatar: ''
    });
  }
});



router.get('/getallcourses', async (req, res) => {
  if (req.session.isLoggined) {
    try {
      const listdata = await fetchAllCourse();
      console.log("===========here data return=========");
      console.log(listdata);

      // Pass the listusers array to the Handlebars view
      res.render('courses', {
        username: req.session.username,
        isLoggined: true,
        userRole: req.session.role,
        fullName: req.session.fullname,
        email: req.session.email,
        useravatar: req.session.picture,
        returnlists: listdata
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).render('error', { error: 'Failed to fetch user data' });
    }
  } else {
    res.render('login', {
      username: '',
      isLoggined: false,
      userRole: '',
      fullName: '',
      email: '',
      useravatar: ''
    });
  }
});



//============================================ USER MANAGEMENT ========================================
//get user lists 
router.get('/getallusers', async (req, res) => {
  if (req.session.isLoggined) {
    try {
      const listusers = await fetchAllUsers();
      console.log("===========here data return=========");
      console.log(listusers); // Logging the data to make sure we received it

      // Pass the listusers array to the Handlebars view
      res.render('usermanagement', {
        username: req.session.username,
        isLoggined: true,
        userRole: req.session.role,
        fullName: req.session.fullname,
        email: req.session.email,
        useravatar: req.session.picture,
        users: listusers
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).render('error', { error: 'Failed to fetch user data' });
    }
  } else {
    res.render('login', {
      username: '',
      isLoggined: false,
      userRole: '',
      fullName: '',
      email: '',
      useravatar: ''
    });
  }
});





// ========================================== QUIZZES 
// get all questions
router.get('/getallquestions', async (req, res) => {
  if (req.session.isLoggined) {
    const listquestions = await fetchAllQuestions();
    console.log("===========here data return=========");
    // console.log(listquestions);
    res.render('index', { username: req.session.username, isLoggined: true, userRole: req.session.role, fullName: req.session.fullname, email: req.session.email, useravatar: req.session.picture });
  } else {
    res.render('login', { username: '', isLoggined: false, userRole: '', fullName: '', email: '', useravatar: '' });
  }
});

// get quiz page 
router.get('/quiz', (req, res) => {
  if (req.session.isLoggined) {
    res.render('quiz', { username: req.session.username, isLoggined: true, userRole: req.session.role });
  } else {
    res.render('login', { username: '', isLoggined: false, userRole: '', fullName: '', email: '', useravatar: '' });
  }
});

// get quiz data  
router.post("/fecthquizdata", CheackHeaderTokenMiddleware, fetchQuestions);

// get user attemp
router.get('/quizAttempts', (req, res) => {
  if (req.session.isLoggined) {
    quizAttempts(req, res);
  } else {
    res.render('login', { username: '', isLoggined: false, userRole: '', fullName: '', email: '', useravatar: '' });
  }
});





export default router;
