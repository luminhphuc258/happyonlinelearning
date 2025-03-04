// Set global variables
let totalcorrects = 0;
let wronganswers = [];
let totalquestions = 5;
let usersoption = [];
let btnsubmitquiz;
let countdown = 60;
let limitedtime = 1;
let myModal;
let user = "";

$(document).ready(function () {
  quiz_initial();
  countdowntime();

  $("#submitQuizBtn").on("click", function () {
    $("#notification_bottom").fadeIn(500);
    showgrade();
    sendGradeToDatabase();
  });


  // Select all checkboxes with class "chkuseroption"
  document.querySelectorAll(".chkuseroption").forEach(checkbox => {
    checkbox.addEventListener("change", function () {
      let questionNumber = this.getAttribute("data-parent");

      // Check if at least one checkbox in the question is checked
      let isChecked = document.querySelector(`.chkuseroption[data-parent="${questionNumber}"]:checked`) !== null;

      if (isChecked) {
        // Highlight the left panel button
        highlightLeftBoardButton(questionNumber, true);
      } else {
        // Restore original color when unchecked
        highlightLeftBoardButton(questionNumber, false);
      }

      //  Ensure only one checkbox is checked per question
      uncheckOtherOptions(questionNumber, this);
    });
  });



  //  Initialize left panel buttons
  function quiz_initial() {
    let leftmenu = document.getElementById("leftboard");
    let totalquestions = $('h5').length;

    for (let i = 0; i < totalquestions; i++) {
      let count = i + 1;
      let btnquestion = document.createElement("button");

      btnquestion.appendChild(document.createTextNode(count));
      btnquestion.setAttribute("class", "w-10 h-10 bg-blue-500 text-white rounded-md btnfixed");
      btnquestion.setAttribute("data-question", count);

      leftmenu.appendChild(btnquestion);
    }

    // Add event listener to left panel buttons for scrolling
    $(document).on("click", ".btnfixed", function () {
      let questionNumber = $(this).attr("data-question");
      scrollToQuestion(questionNumber);
    });
  }
  function highlightAnswer(questionNumber, isCorrect) {
    let checkboxes = document.querySelectorAll(`.chkuseroption[data-parent="${questionNumber}"]`);
    checkboxes.forEach(checkbox => {
      let label = checkbox.nextElementSibling; // Get the label element
      if (checkbox.getAttribute("data-isanswer") === "yes") {
        label.style.backgroundColor = isCorrect ? "green" : "red";
        label.style.color = "white";
      }
    });
  }

  // Function to highlight the left panel button when a checkbox is checked
  function highlightLeftBoardButton(questionNumber, isSelected) {
    let leftButtons = document.querySelectorAll("#leftboard button");

    leftButtons.forEach(button => {
      if (button.innerText.trim() === questionNumber) {
        if (isSelected) {
          button.classList.add("bg-green-500", "text-white"); // Highlight when selected
          button.classList.remove("bg-blue-500");
        } else {
          button.classList.add("bg-blue-500"); // Restore original color
          button.classList.remove("bg-green-500", "text-white");
        }
      }
    });
  }

  // Function to uncheck other options in the same question
  function uncheckOtherOptions(questionNumber, selectedCheckbox) {
    let checkboxes = document.querySelectorAll(`.chkuseroption[data-parent="${questionNumber}"]`);

    checkboxes.forEach(checkbox => {
      if (checkbox !== selectedCheckbox) {
        checkbox.checked = false;
      }
    });
  }

  //  Function to smoothly scroll to the selected question
  function scrollToQuestion(questionNumber) {
    let questionElement = $(`h5:contains('Question ${questionNumber}')`);

    if (questionElement.length) {
      $("html, body").animate({
        scrollTop: questionElement.offset().top - 50 // Adjust offset as needed
      }, 500);
    }
  }

  // Countdown function 
  function countdowntime() {
    const timerInterval = setInterval(function () {
      countdown--;

      if (countdown > 0) {
        document.getElementById("timer").textContent = limitedtime + ":" + (countdown < 10 ? "0" : "") + countdown;
      } else {
        if (limitedtime > 0) {
          limitedtime--;
          countdown = 60;
        } else {
          clearInterval(timerInterval);
          showgrade();
        }
      }
    }, 1000);
  }

  function showgrade() {
    document.getElementById("timer").textContent = "Time's up!";
    document.getElementById("timerdashboard").style.display = "none";

    let totalQuestions = document.querySelectorAll("h5").length;
    totalcorrects = 0;

    usersoption.forEach(choice => {
      let questionNumber = choice.id;
      let isAnswerCorrect = choice.isAnswer;

      if (isAnswerCorrect) {
        totalcorrects++;
        highlightAnswer(questionNumber, true);
      } else {
        wronganswers.push(questionNumber);
        highlightAnswer(questionNumber, false);
      }
    });

    let percentage = Math.round((totalcorrects / totalQuestions) * 100);
    let resultText = `Total correct answers: ${totalcorrects}/${totalQuestions} (${percentage}%)`;
    $("#resultofquiz").text(resultText).show();
  }


});

async function sendGradeToDatabase() {
  let score = (totalcorrects / totalquestions) * 100;
  let start_time = "2024-03-02 10:00:00";
  let submit_time = new Date().toISOString().slice(0, 19).replace("T", " ");
  let quiz_id = localStorage.getItem("quizinputID");
  const url = "http://localhost:3000/studentsubmitQuiz";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quiz_id,
        start_time,
        submit_time,
        score
      }),
    });

    // Handling the response
    const data = await response.json();
    console.log("===> data" + data);

    if (data.status === "success") {
      alert("yes")
      window.location.href = "/";
    } else {
      show_toast_error();
    }
  } catch (error) {
  }

}
