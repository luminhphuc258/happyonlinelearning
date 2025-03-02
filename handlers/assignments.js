import Course from '../models/course.js';

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


export default fetchAllmyCourses;
