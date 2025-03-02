import Course from '../models/course.js';
import Assignment from '../models/assignments.js';
import Submission from '../models/submissions.js';
import Student from '../models/students.js';
import moment from 'moment';
import { Op } from 'sequelize';


// get courses
export const fetchAllmyCourses = async (req, res) => {
  console.log("Calling to get All courses!");

  try {
    // Fetch all courses
    const courses = await Course.findAll({});

    if (courses && courses.length > 0) {
      console.log("=====check active courses data ===");
      console.log(JSON.stringify(courses, null, 2));

      // Map the courses and send the correct data
      const mappedCourses = courses.map(course => ({
        course_id: course.course_id,
        program_id: course.program_id,
        course_code: course.course_code,
        title: course.title,
        description: course.description,
        credits: course.credits,
        semester: course.semester,
        is_active: course.is_active,
        registration_start: course.registration_start,
        registration_end: course.registration_end
      }));

      return mappedCourses;
    } else {
      console.error("Error fetching programs:", error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error."
    });
  }
};

// handle check assignment status
export const checkAssignmentStatus = async (req, res) => {
  try {
    // Get the assignmentId from the request body and studentID from session
    const { assignmentId } = req.body;
    const studentID = req.session.userID;

    //Check if student exists
    const student = await Student.findOne({
      where: { student_id: studentID }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    //Query the submissions table to find submission for the given assignment and student
    const submission = await Submission.findOne({
      where: {
        assignment_id: assignmentId,
        student_id: studentID
      }
    });

    // If no submission is found, respond with a 200 status and a message
    if (!submission) {
      return res.status(200).json({
        message: 'No submission found for this assignment'
      });
    }

    // Check if the submission is graded
    if (submission.is_graded) {
      return res.status(200).json({
        message: 'Assignment has been graded',
        submission: submission
      });
    }

    // Check if the submission is late (by comparing the submission time with the deadline)
    const currentTime = new Date();
    const isLate = new Date(submission.submission_time) > currentTime; // Compare submission time with current time

    if (isLate) {
      return res.status(200).json({
        message: 'Assignment is late',
        submission: submission
      });
    }

    //  Return the submission status if it's neither graded nor late
    return res.status(200).json({
      message: 'Assignment submission is pending',
      submission: submission
    });

  } catch (error) {
    console.error('Error checking assignment status:', error);
    return res.status(500).json({ message: 'An error occurred while checking the submission status' });
  }
};

// handle submission of students
export const HandleAssignmentSubmission = async (req, res) => {
  try {
    console.log(req.body);

    const { assignment_id, file_path, submission_time, submission_text } = req.body;

    // Retrieve student ID based on the currentuserid
    const student = await Student.findOne({
      where: { user_id: req.session.currentuserid }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentID = student.student_id;

    // Check if the submission is late
    const currentTime = moment();
    const submissionTime = moment(submission_time);

    const isLate = submissionTime.isAfter(currentTime);

    // Insert data into the submission table
    const newSubmission = await Submission.create({
      assignment_id,
      student_id: studentID,
      submission_time: submissionTime,
      file_path,
      submission_text,
      is_late: isLate,
      is_graded: false
    });

    // Respond with success message
    res.status(200).json({ message: 'Submission received successfully', data: newSubmission });

  } catch (error) {
    console.error('Error during submission handling:', error);
    res.status(500).json({ message: 'An error occurred during submission' });
  }
};



// get all assignments based on the program id
export const fetchAllAssignment = async (req, res) => {
  console.log("Calling to get All assignments!", req.body);
  let { program_id, course_code } = req.body;
  program_id = program_id.trim();
  course_code = course_code.trim();
  try {
    // Fetch the course by program_id and course_code
    const selectedcourse = await Course.findOne({
      where: {
        program_id: program_id,
        course_code: course_code
      }
    });

    if (selectedcourse) {
      console.log("====> Check point Assignment details lists  ===");
      console.log(JSON.stringify(selectedcourse, null, 2));

      const selectedcourseID = selectedcourse.course_id;
      console.log("check point, course Id:", selectedcourseID);
      // calling to get all assignments of this course.
      const assignments = await Assignment.findAll({
        where: { course_id: selectedcourseID }
      });

      // Retrieve student ID based on the currentuserid
      const student = await Student.findOne({
        where: { user_id: req.session.currentuserid }
      });

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const studentID = student.student_id;

      // get assignment status 
      const mappedAssginments = await Promise.all(assignments.map(async (assignment) => {
        const submission = await Submission.findOne({
          where: {
            assignment_id: assignment.assignment_id,
            student_id: studentID
          }
        });

        // Define the submission status
        let submissionStatus = 'Not Submitted'; // Default status

        // Check submission status
        if (submission) {
          if (submission.is_graded) {
            submissionStatus = 'Graded';
          } else if (submission.is_late) {
            submissionStatus = 'Late';
          } else {
            submissionStatus = 'Pending';
          }
        }

        // Map the assignment data with the status
        return {
          assignment_id: assignment.assignment_id,
          course_id: assignment.course_id,
          title: assignment.title,
          description: assignment.description,
          total_points: assignment.total_points,
          due_date: assignment.due_date,
          submission_status: submissionStatus,
          submission_time: submission ? submission.submission_time : null,
          submission_file: submission ? submission.file_path : null,
          is_published: assignment.is_published
        };
      }));

      // get selected course name
      const coursename = await Course.findAll({
        where: { course_id: selectedcourseID }
      });

      const title = coursename[0]?.dataValues?.title;
      req.session.SelectedAssignmentCourTitle = title;
      req.session.SelectedAssignmentList = mappedAssginments;

      // Pass the data array to the Handlebars view
      return res.status(200).json({ message: "success" });

    } else {
      console.error("Error fetching courses: No course found.");
      return res.redirect('/');
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.redirect('/');
  }
};


export default fetchAllmyCourses;
