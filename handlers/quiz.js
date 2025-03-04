import QuestionsSchema from '../models/questions.js';
import axios from 'axios';
import * as XLSX from 'xlsx';


// Method to create a new question
export const storeQuestion = async (req, res) => {
  console.log("Calling to add new questions");
  console.log(req.body);
  const { file_path, quizid } = req.body;

  // Validate required fields
  if (!file_path || !quizid) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    // Fetch the Excel file from the URL
    const response = await axios.get(file_path, { responseType: 'arraybuffer' });
    const data = response.data;

    // Parse the Excel data
    const workbook = XLSX.read(data, { type: 'buffer' });

    // Get the first sheet from the Excel file
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON format (array of objects)
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Format the data for Node.js route
    const formattedData = jsonData.map(item => ({
      content: item.content,
      answer: item.answer,
      option1: item.option1,
      option2: item.option2,
      option3: item.option3,
      option4: item.option4,
      score: item.score,
      quizid: quizid,
      questiontype: 0,
      images: item.imagepath
      // image_path: item['imagepath']
    }));
    console.log("checkpoint excel data:", formattedData);
    if (formattedData.length > 0) {
      // add questions to database
      const result = await QuestionsSchema.bulkCreate(formattedData);
      console.log(`Successfully inserted ${result.length} questions.`);
      return res.status(200).json({ status: "success" });

    } else {
      return res.status(500).json({ error: 'Cannot convert data to insert questions.' });
    }
  } catch (error) {
    console.error('Error fetching or parsing Excel file:', error);
    return res.status(500).json({ error: 'Failed to insert question.' });
  }

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
export const fetchAllQuestions = async (QuizIDInput) => {
  console.log(" ============= Calling to get questions data =================");
  console.log(QuizIDInput);
  try {
    if (!QuizIDInput) {
      return res.status(404).json({ "message": "lack of inputs" });
    }

    const questions = await QuestionsSchema.findAll({
      where: { quizid: QuizIDInput }
    });
    console.log(questions);

    // Map the data to an array of objects with required fields
    let formattedQuestions = [];
    let index = 1;
    for (const question of questions) {
      formattedQuestions.push({
        id: question.id,
        index: index,
        quiz_id: question.quizid,
        content: question.content,
        option1: question.option1,
        option2: question.option2,
        option3: question.option3,
        option4: question.option4,
        answer: question.answer,
        images: question.images,
        score: question.score
      });
      index++;
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

    const { quizID } = req.body;

    // Find the question by primary key
    const question = await QuestionsSchema.findByPk(quizID);
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    // Delete the question
    await question.destroy();

    // update session data for list questions
    await fetchAllQuestions(quizID);

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return res.status(500).json({ error: 'Failed to delete question.' });
  }
};






