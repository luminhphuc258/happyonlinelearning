$(document).ready(function () {
  // get data for  program combox 
})
async function createCombox_AllCourses(comboxID) {
  try {
    const response = await fetch("http://localhost:3000/getallmycourses", {
      method: "GET",
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      // Assuming data.programs contains the list of programs.
      let options = "";
      data.CourseLists.forEach((course) => {
        options += `<option value="${course.course_id}" programid="${course.program_id}">${course.title}</option>
        `;

      });

      // Append the generated HTML content to the section
      $("#" + comboxID).html(options);

    } else {
      console.error("Cannot load data for combox:", data.message);
    }
  } catch (error) {
    console.error("Error load data:", error);
  }
}


