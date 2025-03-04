document.addEventListener("DOMContentLoaded", function () {
  fetch('/student-tracking') // Adjust API route if needed
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        renderStudentTrackingChart(data.totalAssignments, data.totalQuizzes, data.averageScore);
      } else {
        console.error("Failed to fetch student tracking data.");
      }
    })
    .catch(error => console.error("Error fetching tracking data:", error));
});

// Function to Render Chart
function renderStudentTrackingChart(assignments, quizzes, avgScore) {
  const ctx = document.getElementById('studentTrackingChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Assignments Submitted', 'Quizzes Completed', 'Avg Quiz Score'],
      datasets: [{
        label: 'Student Progress',
        data: [assignments, quizzes, avgScore],
        backgroundColor: ['blue', 'green', 'orange'],
        borderColor: ['blue', 'green', 'orange'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
