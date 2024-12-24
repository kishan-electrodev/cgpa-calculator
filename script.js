const semesterSelect = document.getElementById("semester-select");
const submitSemester = document.getElementById("submit-semester");
const marksForm = document.getElementById("marks-form");
const subjectFormSection = document.getElementById("subject-form");
const calculateButton = document.getElementById("calculate-cgpa");
const resultSection = document.getElementById("result");
const resultTable = document.getElementById("result-table");
const calculatedCgpa = document.getElementById("calculated-cgpa");
const inputTypeSelect = document.getElementById("input-type-select");

submitSemester.addEventListener("click", () => {
  const selectedSemester = semesterSelect.value;
  const selectedInputType = inputTypeSelect.value;

  if (!selectedSemester) {
    alert("Please select a semester.");
    return;
  }

  if (!selectedInputType) {
    alert("Please select Marks or Grade Point.");
    return;
  }

  generateMarksForm(selectedSemester, selectedInputType);
});

calculateButton.addEventListener("click", () => {
  calculateCGPA();
});

function generateMarksForm(semester, inputType) {
  marksForm.innerHTML = "";
  const subjects = semesters[semester];

  subjects.forEach((subject) => {
    const subjectRow = document.createElement("div");
    if (inputType === "marks") {
      subjectRow.innerHTML = `
        <label>${subject.name} (${subject.credits} Credits)</label>
        <input type="number" placeholder="Enter Marks (0-100)" data-credits="${subject.credits}">
      `;
    } else if (inputType === "grade-point") {
      subjectRow.innerHTML = `
        <label>${subject.name} (${subject.credits} Credits)</label>
        <input type="number" placeholder="Enter Grade Point (0-10)" data-credits="${subject.credits}">
      `;
    }
    marksForm.appendChild(subjectRow);
  });

  subjectFormSection.classList.remove("hidden");
}

function calculateCGPA() {
  const inputs = marksForm.querySelectorAll("input");
  let totalCredits = 0;
  let weightedGradePoints = 0;

  resultTable.innerHTML = `
    <tr>
      <th>Course Code</th>
      <th>Subject</th>
      <th>Credits</th>
      <th>Grade</th>
      <th>Grade Points</th>
    </tr>
  `;

  inputs.forEach((input, index) => {
    const value = Number(input.value);
    const credits = Number(input.dataset.credits);

    let gradePoint;

    if (inputTypeSelect.value === "marks") {
      gradePoint = getGradePoint(value);
    } else if (inputTypeSelect.value === "grade-point") {
      gradePoint = value;
    }

    if (!isNaN(value)) {
      totalCredits += credits;
      console.log(totalCredits);
      weightedGradePoints += gradePoint * credits;

      const row = `
        <tr>
          <td>${semesters[semesterSelect.value][index].code}</td>
          <td>${semesters[semesterSelect.value][index].name}</td>
          <td>${credits}</td>
          <td>${getGradeLetter(value, inputTypeSelect.value)}</td>
          <td>${gradePoint}</td>
        </tr>
      `;
      resultTable.innerHTML += row;
    }
  });

  const cgpa = (weightedGradePoints / totalCredits).toFixed(2);
  calculatedCgpa.textContent = cgpa;
  resultSection.classList.remove("hidden");
}

function getGradePoint(marks) {
  if (marks >= 90) return 10;
  if (marks >= 80) return 9;
  if (marks >= 70) return 8;
  if (marks >= 60) return 7;
  if (marks >= 50) return 6;
  if (marks >= 40) return 5;
  return 0;
}

function getGradeLetter(value, inputType) {
  if (inputType === "marks") {
    if (value >= 90) return "O";
    if (value >= 80) return "A+";
    if (value >= 70) return "A";
    if (value >= 60) return "B+";
    if (value >= 50) return "B";
    if (value >= 40) return "C";
    return "F";
  } else if (inputType === "grade-point") {
    if (value === 10) return "O";
    if (value >= 9) return "A+";
    if (value >= 8) return "A";
    if (value >= 7) return "B+";
    if (value >= 6) return "B";
    if (value >= 5) return "C";
    return "F";
  }
}
