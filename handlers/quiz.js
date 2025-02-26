import QuestionsSchema from '../models/questions.js';
// Method to create a new question
export const storeQuestion = async (req, res) => {
  // try {
  console.log("Calling to add new questions");
  console.log(req.body);

  const { content, option1, option2, option3, option4, answer, questiontype, score, quizid, images } = req.body;

  // Validate required fields
  if (!content || !option1 || !option2 || !option3 || !option4 || !answer || !questiontype || !quizid) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create a new question record
  const newQuestion = await QuestionsSchema.create({ content, option1, option2, option3, option4, answer, questiontype, score, quizid, images });

  return res.status(201).json(newQuestion);
  // } catch (error) {
  //   console.error('Error storing question:', error);
  //   return res.status(500).json({ error: 'Failed to create question.' });
  // }
};

// Method to update an existing question
export const updateQuestion = async (req, res) => {
  try {
    console.log("Calling update!");
    console.log(req.body);

    const { id, content, option1, option2, option3, option4, answer, questiontype, score, quizid, images } = req.body;

    // Find the question by primary key
    const question = await QuestionsSchema.findByPk(id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    // Update only provided fields
    question.content = content || question.content;
    question.option1 = option1 || question.option1;
    question.option2 = option2 || question.option2;
    question.option3 = option3 || question.option3;
    question.option4 = option4 || question.option4;
    question.answer = answer || question.answer;
    question.questiontype = questiontype || question.questiontype;
    question.score = score || question.score;
    question.quizid = quizid || question.quizid;
    question.images = images || question.images;

    // Save the changes
    await question.save();

    return res.status(200).json(question);
  } catch (error) {
    console.error('Error updating question:', error);
    return res.status(500).json({ error: 'Failed to update question.' });
  }
};

// fetch all questions 
// Method to fetch all questions
export const fetchAllQuestions = async (req, res) => {
  try {
    console.log(" ============= Calling to get questions data =================");
    const questions = await QuestionsSchema.findAll();
    // Map the data to an array of objects with required fields
    let formattedQuestions = [];
    for (const question of questions) {
      formattedQuestions.push({
        questionNumber: question.id,
        questionContent: question.content,
        option1: question.option1,
        option2: question.option2,
        option3: question.option3,
        option4: question.option4,
        answer: question.answer,
        score: question.score
      });
    }
    return formattedQuestions;
  } catch (error) {
    return null;
  }
};



// Method to fetch all questions
export const fetchQuestions = async (req, res) => {
  const totalChosenQuestions = parseInt(req.body.totalchosenquestions, 10);
  let totalCreatedQuestions = 0;

  try {
    console.log(" ============= Calling to get questions data =================");
    const questions = await QuestionsSchema.findAll();

    // Map the data to an array of objects with required fields
    const formattedQuestions = [];

    for (const question of questions) {
      if (totalCreatedQuestions < totalChosenQuestions) {
        formattedQuestions.push({
          questionNumber: question.id,
          questionContent: question.content,
          option1: question.option1,
          option2: question.option2,
          option3: question.option3,
          option4: question.option4,
          answer: question.answer,
          image: question.images || null
        });
        totalCreatedQuestions++;
      } else {
        break;
      }
    }
    console.log(`Total Questions Chosen: ${totalChosenQuestions}`);
    console.log(`Total Questions Returned: ${formattedQuestions.length}`);

    // Return JSON response with limited questions
    return res.status(200).json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return res.status(500).json({ error: 'Failed to fetch questions.' });
  }
};

// Method to delete a question
export const deleteQuestion = async (req, res) => {
  try {
    console.log("Calling delete question!");
    console.log(req.body);

    const { id } = req.body;

    // Find the question by primary key
    const question = await QuestionsSchema.findByPk(id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    // Delete the question
    await question.destroy();

    return res.status(200).json({ message: 'Question deleted successfully.' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return res.status(500).json({ error: 'Failed to delete question.' });
  }
};
