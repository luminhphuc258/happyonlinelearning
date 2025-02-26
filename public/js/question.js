document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addquestionform");

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      // Sanitize function to remove dangerous characters
      const sanitize = (str) => str.replace(/[<>'"(){};]/g, "").trim();

      // Get form values & sanitize inputs
      const quiztopic = document.getElementById("quiztopic1").value;
      const qcontent = sanitize(document.getElementById("qcontent").value);
      const option1 = sanitize(document.getElementById("option1").value);
      const option2 = sanitize(document.getElementById("option2").value);
      const option3 = sanitize(document.getElementById("option3").value);
      const option4 = sanitize(document.getElementById("option4").value);
      const qanswer = sanitize(document.getElementById("qanswer").value);
      const qscore = document.getElementById("qscore").value;
      const qimages = sanitize(document.getElementById("qimages").value);
      const qtype = '0';

      // Validate required fields
      if (!quiztopic || !qcontent || !option1 || !option2 || !option3 || !option4 || !qanswer || isNaN(qscore)) {
        alert("Please fill out all required fields correctly.");
        return;
      }

      // Validate score is a positive number
      if (qscore <= 0) {
        alert("Score must be a positive number.");
        return;
      }

      // Send Data to the Server
      const url = "http://localhost:3000/storeQuestion";
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: qcontent,
            option1,
            option2,
            option3,
            option4,
            answer: qanswer,
            questiontype: qtype,
            score: qscore,
            quizid: quiztopic,
            images: qimages
          })
        });

        const data = await response.json();

        if (response.ok) {
          alert("Question added successfully!");
          console.log("Response Data:", data);
          form.reset();
          location.reload();
        } else {
          alert(`Error: ${data.message}`);
          console.error("Error:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to connect to the server!");
      }
    });
  } else {
    console.error("Form not found!");
  }
});
