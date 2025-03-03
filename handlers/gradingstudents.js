import Course from '../models/course.js';
import Assignment from '../models/assignments.js';
import Submission from '../models/submissions.js';
import Student from '../models/students.js';
import UserSchema from '../models/user.js';
// get all submissions for each assignment in the selected course
export const fetchAllAssignmentForInstructor = async (req, res) => {
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

    if (!selectedcourse) {
      console.error("Error fetching courses: No course found.");
      return res.status(404).json({ message: 'Course not found' });
    }

    console.log("====> Check point Assignment details lists ===");
    console.log(JSON.stringify(selectedcourse, null, 2));

    const selectedcourseID = selectedcourse.course_id;
    console.log("Check point, course Id:", selectedcourseID);

    // Fetch all assignments of the selected course
    const assignments = await Assignment.findAll({
      where: { course_id: selectedcourseID }
    });

    if (!assignments.length) {
      return res.status(404).json({ message: 'No assignments found for this course' });
    }

    // Get assignment submissions and group by assignment_id
    const groupedAssignments = await Promise.all(assignments.map(async (assignment) => {
      // Fetch all submissions for the current assignment
      const submissions = await Submission.findAll({
        where: {
          assignment_id: assignment.assignment_id
        },
        include: [
          {
            model: Student,
            as: 'student',
            include: [
              {
                model: UserSchema,
                as: 'user',
                attributes: ['first_name', 'last_name']
              }
            ]
          },
          {
            model: Assignment,
            as: 'assignment',
            attributes: ['title', 'description']
          }
        ]
      });

      // Map submission data along with student information
      const submissionDetails = submissions.map(submission => {
        let submissionStatus = 'Not Submitted';

        // Determine submission status
        if (submission.is_graded) {
          submissionStatus = 'Graded';
        } else if (submission.is_late) {
          submissionStatus = 'Late';
        } else {
          submissionStatus = 'Pending';
        }

        return {
          student_id: submission.student_id,
          first_name: submission.student.user.first_name,  // Access the first name from user
          last_name: submission.student.user.last_name,    // Access the last name from user
          submission_status: submissionStatus,
          submission_time: submission.submission_time,
          submission_file: submission.file_path,
          earned_points: submission.earned_points,
          feedback: submission.feedback,
        };
      });

      // Return grouped assignment data with submission details
      return {
        assignment_id: assignment.assignment_id,
        course_id: assignment.course_id,
        title: assignment.title,
        description: assignment.description,
        total_points: assignment.total_points,
        due_date: assignment.due_date,
        is_published: assignment.is_published,
        submissions: submissionDetails
      };
    }));

    // show log
    console.log("Grouped Assignments Data:", JSON.stringify(groupedAssignments, null, 2));


    // Get selected course name using findOne instead of findAll
    const courseName = await Course.findOne({
      where: { course_id: selectedcourseID }
    });

    const title = courseName?.dataValues?.title;
    req.session.SelectedAssignmentCourTitleInstructor = title;
    req.session.SelectedgroupedAssignments = groupedAssignments;

    // Return grouped assignments data in response
    return res.status(200).json({ message: "success", data: groupedAssignments });

  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// update grade  handleUpdateGrade
export const handleUpdateGrade = async (req, res) => {
  try {
    console.log("check point to update grade", req.body);
    // Extract the data from the request body
    const { studentid, assignmentid, grade, feedback } = req.body;

    // Validate the input data
    if (!studentid || !assignmentid || grade === undefined || feedback === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find the submission for the given student and assignment
    const submission = await Submission.findOne({
      where: {
        student_id: studentid,
        assignment_id: assignmentid,
      }
    });

    // If no submission is found, return an error
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found for the specified assignment and student' });
    }

    // Update the grade and feedback in the submission
    submission.earned_points = grade;
    submission.feedback = feedback;
    submission.is_graded = 1;

    // Save the updated submission
    await submission.save();

    // Return a success message
    console.log("ipdate successfully!");
    res.status(200).json({ message: 'Grade and feedback updated successfully' });

  } catch (error) {
    console.error('Error updating grade and feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
