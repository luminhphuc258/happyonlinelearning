import Quiz from '../models/quizzes.js';
import QuestionsSchema from '../models/questions.js';
// Method to add a new quiz
export const storeQuiz = async (req, res) => {
  try {
    console.log("Adding new quiz...");
    const { course_id, title, description, start_time, end_time, duration_minutes, total_points, is_published } = req.body;
    console.log(req.body);
    // Validate required fields
    if (!course_id || !title || !start_time || !end_time || !duration_minutes || !total_points) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new quiz
    const newQuiz = await Quiz.create({
      course_id,
      title,
      description,
      start_time,
      end_time,
      duration_minutes,
      total_points,
      is_published: is_published || 0,
    });

    return res.status(200).json({ "status": 'success' });
  } catch (error) {
    console.error('Error adding new quiz:', error);
    return res.status(500).json({ error: 'Failed to add new quiz' });
  }
};


// Method to delete a quiz
export const deleteQuiz = async (req, res) => {
  try {
    console.log("Calling delete quiz!");
    console.log(req.body);

    const { quizID } = req.body;

    // Find the question by primary key
    const quiz = await Quiz.findByPk(quizID);
    if (!quiz) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    // Delete the question
    await quiz.destroy();

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return res.status(500).json({ error: 'Failed to delete question.' });
  }
};


// Method to fetch all questions for a specific quiz based on quiz_id
export const fetchQuestionsByQuiz = async (req, res) => {
  try {
    const { quiz_id } = req.params;

    // Validate quiz_id
    if (!quiz_id) {
      return res.status(400).json({ error: 'Quiz ID is required' });
    }

    // Fetch questions associated with the given quiz_id
    const questions = await QuestionsSchema.findAll({
      where: { quizid: quiz_id },
    });

    // Check if questions were found
    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for this quiz' });
    }

    // Return the list of questions
    return res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

export const fetchAllQuizQuestions = async (req, res) => {
  try {
    // Fetch all questions and include the associated quiz details
    const quizQuestions = await QuestionsSchema.findAll({
      include: [{
        model: Quiz,
        as: 'quiz',
        attributes: ['quiz_id', 'title', 'course_id']
      }]
    });

    // Check if there are any quiz questions
    if (quizQuestions.length === 0) {
      res.status(200).json({
        status: "success",
        message: "no data"
      })
    }

    // Return the list of quiz questions with their associated quiz details
    res.status(200).json({ message: 'Get data successfully', quizzes: quizQuestions });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return res.status(500).json({ message: 'Failed to fetch quiz questions' });
  }
};

// Method to fetch all quizzes with their details
export const fetchAllQuizzes = async (req, res) => {
  try {

    // Fetch all quizzes with the necessary details
    const quizzes = await Quiz.findAll({
      attributes: [
        'quiz_id',        // Quiz ID
        'title',          // Quiz title
        'is_published',   // Whether the quiz is published
        'start_time',     // Quiz start time
        'end_time',       // Quiz end time
        'total_points'    // Total points for the quiz
      ]
    });

    console.log("Quizzes fetched:", quizzes);

    // If no quizzes are found, return a 404 error
    if (quizzes.length === 0) {
      return null;
    }

    // Return quizzes in the response
    return quizzes.map((quiz) => ({
      quiz_id: quiz.quiz_id,
      title: quiz.title,
      is_published: quiz.is_published,
      start_time: quiz.start_time,
      end_time: quiz.end_time,
      total_points: quiz.total_points
    }));

  } catch (error) {
    console.log('Error fetching quizzes:', error);

    // Handle cases where `res` might not be available
    if (res) {
      return null;
    } else {
      console.error('Response object is missing, unable to send response');
    }
  }
};


// Method to fetch all quizzes with their details
export const fetchAllQuizzesByCourseID = async (CourseID) => {
  try {
    // Fetch all quizzes with the necessary details
    const quizzes = await Quiz.findAll({
      where: { course_id: CourseID },
      attributes: [
        'quiz_id',        // Quiz ID
        'title',          // Quiz title
        'is_published',   // Whether the quiz is published
        'start_time',     // Quiz start time
        'end_time',       // Quiz end time
        'total_points'    // Total points for the quiz
      ]
    });

    console.log("Quizzes fetched:", quizzes);

    // If no quizzes are found, return a 404 error
    if (quizzes.length === 0) {
      return null;
    }

    // Return quizzes in the response
    return quizzes.map((quiz) => ({
      quiz_id: quiz.quiz_id,
      title: quiz.title,
      is_published: quiz.is_published,
      start_time: quiz.start_time,
      end_time: quiz.end_time,
      total_points: quiz.total_points
    }));

  } catch (error) {
    console.log('Error fetching quizzes:', error);

    // Handle cases where `res` might not be available
    if (res) {
      return null;
    } else {
      console.error('Response object is missing, unable to send response');
    }
  }
};




