//set global variable
let totalcorrects = 0
let wronganswers = []
let totalquestions = 5
let usersoption = []
let btnsubmitquiz
let countdown = 60;
let limitedtime = 1
let myModal
let user = ""
let quizID = "1";


document.addEventListener("DOMContentLoaded", function () {
  //start quiz
  document.getElementById("btnStartQuiz").addEventListener("click", async function (event) {
    startquiz();
  });

  // reset quiz
  document.getElementById("btnReserQuiz").addEventListener("click", async function (event) {
    restartQuiz();
  });

  // submit quiz
  document.getElementById("btnSubmitQuiz").addEventListener("click", async function (event) {
    showConfirmModal();
  });


});



function restartQuiz() {
  window.location.reload()
}

function startquiz() {
  const quiztopic = document.getElementById("quiztopic").value;
  const numberofquestions = document.getElementById("btnnumberquestions").value;

  if (!quiztopic || !numberofquestions) {
    alert("Please select all esstinal information!");
    return;
  }

  // assign value to total numbers
  totalquestions = numberofquestions
  quizID = quiztopic;

  document.getElementById("menusetting").style.display = "none"
  let leftmenu = document.getElementById("leftboard")

  // create button for right menu 
  for (let i = 0; i < totalquestions; i++) {
    var btnquestion = document.createElement("button");
    let count = i + 1;
    btnquestion.appendChild(document.createTextNode(count));
    //set class name for each button
    btnquestion.setAttribute("class", "btn btn-info mr-1 btnfixed");
    btnquestion.setAttribute("data-question", count);
    console.log(btnquestion)
    // Add buton into cell 
    leftmenu.appendChild(btnquestion)
    //==================================
  }

  //create question 
  create_Questions(totalquestions)
}

function showConfirmModal() {
  $('#confirmModal').modal('show');
}


function cancelAction() {
  myModal.hide()
}
// when user confirm to submit the quiz
function confirmAction() {
  console.log('Decided to submit quiz!');
  // Close the modal after action;
  $('#confirmModal').modal('hide');
  // Calculate grade
  showgrade()

}

var GetFileBlobUsingURL = function (url, convertBlob) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.addEventListener('load', function () {
    convertBlob(xhr.response);
  });
  xhr.send();
};

var blobToFile = function (blob, name) {
  blob.lastModifiedDate = new Date();
  blob.name = name;
  return blob;
};

var GetFileObjectFromURL = function (filePathOrUrl, convertBlob) {
  GetFileBlobUsingURL(filePathOrUrl, function (blob) {
    convertBlob(blobToFile(blob, 'questiondata.csv'));
  });
};

function create_Questions(totalquestionschosen) {
  let totalCreatedQuestions = 0
  // get data from mysql and read in loop
  const url = "http://localhost:3000/fecthquizdata";
  // get current user token
  const token = localStorage.getItem("token");
  if (token) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token
      },
      body: JSON.stringify({
        totalchosenquestions: totalquestionschosen
      })
    })
      .then(response => response.json())
      .then(data => {
        if (!Array.isArray(data)) {
          alert('Error: Unexpected response format.');
          return;
        }
        console.log('Fetched data:', data);
        // Loop over each question in the response
        data.forEach((question, index) => {
          if (question && question.questionNumber && question.questionContent) {
            createQuestionCard(
              question.questionNumber,
              question.questionContent,
              [question.option1, question.option2, question.option3, question.option4],
              question.answer,
              question.image
            );
            totalCreatedQuestions++;
          } else {
            console.warn(`Skipping invalid question at index ${index}:`, question);
          }
        });

        console.log(`Total Questions Created: ${totalCreatedQuestions}`);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
        alert('Cannot fetch new questions. Please try again.');
      });
  } else {
    alert("Token expired, Please login again for security reasons!");
  }
  //start countdown
  countdowntime()
}


function createQuestionCard(questionNumber, questionText, options, answer, imagepath) {
  // Create the card div
  const card = document.createElement('div');
  card.className = 'panel panel-default';
  card.style.fontSize = "13px";
  // Create the card header
  const cardHeader = document.createElement('h5');
  cardHeader.className = 'panel-heading';
  cardHeader.textContent = `Question ${questionNumber}`;
  card.appendChild(cardHeader);

  // Create the card body
  const cardBody = document.createElement('div');
  cardBody.className = 'panel-body';

  // Create the question title
  const cardTitle = document.createElement('h5');
  cardTitle.className = 'panel-title';
  cardTitle.textContent = questionText;
  cardBody.appendChild(cardTitle);

  // Create and add image
  console.log("\n path:" + imagepath)
  if (imagepath) {
    // Create a new img element
    let newImage = document.createElement('img');
    newImage.style.width = "50%"
    newImage.style.height = "50%"
    newImage.style.marginTop = "10px"
    newImage.style.marginLeft = "5%"
    newImage.className = 'img-responsive';
    // Set the src attribute of the img element
    newImage.src = imagepath;
    let hr = document.createElement("hr")
    cardBody.appendChild(newImage);
    cardBody.appendChild(hr);
  }
  // Create the options (checkboxes)
  options.forEach((optionText, index) => {
    const optionContainer = document.createElement('div');

    const checkbox = document.createElement('input');
    checkbox.className = 'chkuseroption';
    checkbox.setAttribute("data-parent", questionNumber);
    checkbox.setAttribute("data-userchoice", index);

    if (optionText.toLowerCase() === answer.toLowerCase()) {
      checkbox.setAttribute("data-isanswer", "yes");
    } else {
      checkbox.setAttribute("data-isanswer", "no");
    }

    checkbox.type = 'checkbox';
    checkbox.id = `option${questionNumber}_${index}`;
    checkbox.name = `question${questionNumber}`;

    const label = document.createElement('label');
    label.className = 'questioncheckbox';
    label.setAttribute("data-parent", questionNumber);
    label.setAttribute("data-userchoice", index);
    if (optionText.toLowerCase() === answer.toLowerCase()) {
      label.setAttribute("data-isanswer", "yes");
    } else {
      label.setAttribute("data-isanswer", "no");
    }
    label.htmlFor = checkbox.id;
    label.style.fontSize = "13px";
    label.textContent = optionText;
    optionContainer.appendChild(checkbox);
    optionContainer.appendChild(label);
    cardBody.appendChild(optionContainer);
  });


  // Append the card body to the card
  card.appendChild(cardBody);

  // Append the card to the container
  document.getElementById('questionsboard').appendChild(card);
  // show button submit quiz 
  document.getElementById('containersubmitquiz').style.display = 'block';
}



function updateObjectInArray(array, newObject) {
  let exists = false;

  // Use map to iterate and replace the object if it exists
  const updatedArray = array.map(obj => {
    if (obj.id === newObject.id) {
      exists = true;
      return newObject; // Replace the old object with the new one
    }
    return obj; // Keep the existing object if it's not the one to replace
  });

  // If the object did not exist, add the new one
  if (!exists) {
    updatedArray.push(newObject);
  }

  return updatedArray;
}

function calculatePercentageGrade(scoreObtained, totalScore) {
  if (totalScore === 0) {
    return 0;
  }

  const percentage = Math.ceil((scoreObtained / totalScore) * 100);
  return percentage.toFixed(2) + '%';
}

function showgrade() {
  document.getElementById("timer").textContent = "Time's up!";
  document.getElementById("containersubmitquiz").style.display = "none"
  document.getElementById("timerdashboard").style.display = "none"
  console.log(usersoption)
  changecolor_correctanswer()

  // higlight wrong answers and show the grade
  for (let i = 0; i < usersoption.length; i++) {
    let questionnumber = usersoption[i].id
    let usranswer = usersoption[i].name
    let userselected = usersoption[i].userselected
    console.log(usranswer)
    if (usranswer === "yes") {
      totalcorrects++
    } else {
      wronganswers.push(questionnumber)
      changecolor_wronganswer(questionnumber, userselected)
    }
  }
  resulttxt = document.getElementById("resultofquiz")
  resulttxt.style.display = "block"
  let btnrestart = document.getElementById("restartarea")
  btnrestart.style.display = "block"
  let totalques = totalquestions
  console.log("total ques:" + totalques)
  let percentage = calculatePercentageGrade(totalcorrects, totalquestions)
  resulttxt.innerText = "Total correct answers: " + totalcorrects + "/" + totalquestions + " (" + percentage + ")"
  // alert(totalcorrects);
  // send data to store into quizze attempt
  const url = "http://localhost:3000/adduserscore";

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      score: totalcorrects,
      quizid: quizID
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      alert('Update Score Successfully!');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Some error occured!');
    });

}

function get_Date_Today() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  const hours = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds()
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return hours + ":" + minutes + ":" + seconds + " " + ampm + " (" + mm + '/' + dd + '/' + yyyy + ")";
}
function changecolor_wronganswer(parentID, userchoice) {
  let checkoptions = document.querySelectorAll(".questioncheckbox")
  console.log(checkoptions)
  for (var k = 0; k < checkoptions.length; k++) {
    var curentuserchoice = checkoptions[k].getAttribute("data-userchoice");
    var currentparentid = checkoptions[k].getAttribute("data-parent");
    if (currentparentid === parentID && curentuserchoice === userchoice) {
      checkoptions[k].style.backgroundColor = "red"
      checkoptions[k].style.color = "white"
    }
  }
}


function changecolor_correctanswer() {
  let checkoptions = document.querySelectorAll(".questioncheckbox")
  console.log(checkoptions)
  for (var k = 0; k < checkoptions.length; k++) {
    var correctChoicePostion = checkoptions[k].getAttribute("data-isanswer");
    if (correctChoicePostion === "yes") {
      checkoptions[k].style.backgroundColor = "green"
      checkoptions[k].style.color = "white"
    }
  }
}

function lockAllControl() {
  let checkoptions = document.querySelectorAll(".questioncheckbox")
  console.log(checkoptions)
  // lock all checkbox
  for (var k = 0; k < checkoptions.length; k++) {
    checkoptions[k].disabled = true;
  }
}




function uncheckotheroptions(parentID, userchoice) {
  let checkoptions = document.querySelectorAll(".chkuseroption")
  console.log(checkoptions)
  for (var k = 0; k < checkoptions.length; k++) {
    var curentuserchoice = checkoptions[k].getAttribute("data-userchoice");
    var currentparentid = checkoptions[k].getAttribute("data-parent");
    if (currentparentid === parentID && curentuserchoice !== userchoice) {
      checkoptions[k].checked = false;
    }
  }
}

function higlight_leftboardbutton(numbersaved) {
  let leftbtns = document.querySelectorAll(".btnfixed")
  console.log(leftbtns)
  for (var k = 0; k < leftbtns.length; k++) {
    var questionnumber = leftbtns[k].innerText
    if (questionnumber === numbersaved) {
      // Access the parent element
      // leftbtns[k].style.backgroundColor = "green"
      leftbtns[k].style.backgroundColor = (leftbtns[k].style.backgroundColor === "green") ? "" : "green";
    }
  }
}

function highlight_leftboardbutton(numbersaved) {
  let leftbtns = document.querySelectorAll(".btnfixed");
  console.log(leftbtns);

  leftbtns.forEach((btn) => {
    let questionNumber = btn.innerText.trim(); // Trim spaces to ensure proper comparison

    if (questionNumber === String(numbersaved)) {
      // Toggle background color
      btn.style.backgroundColor = (btn.style.backgroundColor === "green") ? "" : "green";
    }
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0, // Scrolls to the top of the page
    behavior: 'smooth' // Enables smooth scrolling
  });
}

//catch event click checkbox
window.onclick = e => {
  let targetclassname = e.target.className
  console.log(targetclassname)
  //check if player is clicking any cell on the chessboard
  if (targetclassname === "chkuseroption") {
    let clickedpostion = e.target
    //change background color
    //clickedpostion.style.backgroundColor = "red"
    clickedpostion.style.backgroundColor = "green";
    clickedpostion.style.color = "white";
    //get the cell postion (row, column) of the target 
    let questionnumber = clickedpostion.getAttribute("data-parent");
    let isanswer = clickedpostion.getAttribute("data-isanswer");
    let userschecked = clickedpostion.getAttribute("data-userchoice");
    higlight_leftboardbutton(questionnumber)
    uncheckotheroptions(questionnumber, userschecked)
    if (isanswer) {
      let userchoices = { id: questionnumber, name: isanswer, userselected: userschecked }
      usersoption = updateObjectInArray(usersoption, userchoices);
    }
  } else if (targetclassname === "btn btn-info mr-1 btnfixed") {
    let ismoved = false
    let btntarget = e.target
    let questionnumber = btntarget.innerText
    console.log(questionnumber)
    //locate the button 
    let checkoptions = document.querySelectorAll(".questioncheckbox")
    for (var k = 0; k < checkoptions.length; k++) {
      var correctChoicePostion = checkoptions[k].getAttribute("data-parent");
      if (correctChoicePostion === questionnumber && !ismoved) {
        // Get the position of the element relative to the viewport
        const rect = checkoptions[k].getBoundingClientRect();
        const topPosition = (rect.top + window.pageYOffset) - 310;
        console.log(topPosition)
        // Scroll to the element's position
        window.scrollTo({
          top: topPosition, // Use rect.top for relative scrolling
          behavior: 'smooth' // Smooth scroll
        });
        ismoved = true
      }
    }
  }
}

//countdown function 
function countdowntime() {
  const timerInterval = setInterval(function () {
    countdown--;

    if (countdown > 0) {
      if (countdown >= 10) {
        document.getElementById("timer").textContent = limitedtime + ":" + countdown;
      } else {
        document.getElementById("timer").textContent = limitedtime + ":0" + countdown;
      }

    } else {
      if (limitedtime > 0) {
        limitedtime--;
        if (countdown >= 10) {
          document.getElementById("timer").textContent = limitedtime + ":" + countdown;
        } else {
          document.getElementById("timer").textContent = limitedtime + ":0" + countdown;
        }
        countdown = 60
      } else {
        if (countdown > 0) {
          limitedtime--;
          if (countdown >= 10) {
            document.getElementById("timer").textContent = countdown;
          } else {
            document.getElementById("timer").textContent = "0" + countdown;
          }

        } else {
          clearInterval(timerInterval);

          showgrade()

        }
      }

    }
  }, 1000);
}
