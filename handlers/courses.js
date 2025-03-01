import Course from '../models/course.js';
import Program from '../models/programs.js';
import dotenv from "dotenv";

dotenv.config();

export const addCourse = async (req, res) => {
  console.log("Calling add course!");
  console.log(req.body);

  const { program_id, course_code, title, description, credits, semester, registration_start, registration_end } = req.body;

  // Validate required fields
  if (!program_id || !course_code || !title || !credits || !semester || !registration_start || !registration_end) {
    return res.status(400).json({
      status: "error",
      message: "Program ID, course code, title, credits, semester, registration start, and registration end are required."
    });
  }

  try {
    const existingData = await Course.findOne({
      where: {
        course_code // Check for duplicate course code
      }
    });

    if (existingData) {
      return res.status(409).json({
        status: "error",
        message: "Course already exists."
      });
    }

    const newCourse = await Course.create({
      program_id,
      course_code,
      title,
      description: description || null,
      credits,
      semester,
      is_active: true, // default to active
      registration_start,
      registration_end
    });

    console.log("Course creation successful:");

    // Return success response with course data
    res.status(200).json({
      status: "success",
      message: "Course created successfully",
      course: {
        course_id: newCourse.course_id,
        course_code: newCourse.course_code,
        title: newCourse.title,
        description: newCourse.description,
        credits: newCourse.credits,
        semester: newCourse.semester,
        is_active: newCourse.is_active,
        registration_start: newCourse.registration_start,
        registration_end: newCourse.registration_end
      }
    });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error."
    });
  }
};



export const fetchAllCourse = async () => {
  try {
    console.log("============ Calling to get active courses data ================");

    const allCourses = await Course.findAll({
      where: {
        is_active: true // Only fetch courses that are active
      }
    });
    console.log("=====check active courses data ===");
    console.log(JSON.stringify(allCourses, null, 2));

    return allCourses.map(course => ({
      course_id: course.course_id,
      course_code: course.course_code,
      title: course.title,
      description: course.description,
      credits: course.credits,
      semester: course.semester,
      is_active: course.is_active,
      registration_start: course.registration_start,
      registration_end: course.registration_end
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

export const deleteCourse = async (req, res) => {
  console.log("Calling to delete this course");
  const { course_id } = req.body;

  try {
    console.log("Calling to delete this course", course_id);

    const result = await Course.destroy({
      where: {
        course_id
      }
    });

    if (result === 0) {
      return res.status(404).json({
        status: "error",
        message: "Course not found."
      });
    }

    res.status(200).json({
      status: "success",
      message: "Course deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      status: "error",
      message: "Internal server error."
    });
  }
};

export default addCourse;
