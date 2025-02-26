import QuizScores from '../models/userscore.js';

// get user Attemp data
export const quizAttempts = async (req, res) => {
  try {
    const attempts = await QuizScores.findAll({ raw: true });
    res.render('quizAttempts', { attempts, username: req.session.username, isLoggined: true, userRole: req.session.role });
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    res.status(500).send('Error retrieving quiz attempts.');
  }
};

// Method to create a new quiz score
export const storeQuizScore = async (req, res) => {
  try {
    console.log("Calling store user attemp!");
    console.log(req.body);
    const username = req.session.username;
    console.log(username);
    const { score, quizid } = req.body;

    // Validate required fields
    if (!username || !quizid) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new quiz score record
    const newQuizScore = await QuizScores.create({ username, score, quizid });

    return res.status(201).json(newQuizScore);
  } catch (error) {
    console.error('Error storing quiz score:', error);
    return res.status(500).json({ error: 'Failed to create quiz score.' });
  }
};

// Method to update an existing quiz score
export const updateQuizScore = async (req, res) => {
  try {
    console.log("Calling update!");
    console.log(req.body);

    const { id, username, score, quizid } = req.body;

    // Find the quiz score by primary key
    const quizScore = await QuizScores.findByPk(id);
    if (!quizScore) {
      return res.status(404).json({ error: 'Quiz score not found.' });
    }

    // Update only provided fields
    quizScore.username = username || quizScore.username;
    quizScore.score = score !== undefined ? score : quizScore.score;
    quizScore.quizid = quizid || quizScore.quizid;

    // Save the changes
    await quizScore.save();

    return res.status(200).json(quizScore);
  } catch (error) {
    console.error('Error updating quiz score:', error);
    return res.status(500).json({ error: 'Failed to update quiz score.' });
  }
};

// Method to fetch all quiz scores
export const fetchQuizScores = async (req, res) => {
  try {
    console.log("Fetching all quiz scores...");

    const quizScores = await QuizScores.findAll();

    return res.status(200).json(quizScores);
  } catch (error) {
    console.error('Error fetching quiz scores:', error);
    return res.status(500).json({ error: 'Failed to fetch quiz scores.' });
  }
};

// Method to delete a quiz score
export const deleteQuizScore = async (req, res) => {
  try {
    console.log("Calling delete quiz score!");
    console.log(req.body);

    const { id } = req.body;

    // Find the quiz score by primary key
    const quizScore = await QuizScores.findByPk(id);
    if (!quizScore) {
      return res.status(404).json({ error: 'Quiz score not found.' });
    }

    // Delete the quiz score
    await quizScore.destroy();

    return res.status(200).json({ message: 'Quiz score deleted successfully.' });
  } catch (error) {
    console.error('Error deleting quiz score:', error);
    return res.status(500).json({ error: 'Failed to delete quiz score.' });
  }
};
