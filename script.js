function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


var studentsData = [
    { group: "A", name: "John", gender: "Male", birthday: "2000-01-01", status: "Active" },
    { group: "B", name: "Jane", gender: "Female", birthday: "2000-02-02", status: "Inactive" },
    // Add more data here
];

var currentPage = 1;
var studentsPerPage = 10;

function renderStudents(page) {
    var startIndex = (page - 1) * studentsPerPage;
    var endIndex = startIndex + studentsPerPage;
    var students = studentsData.slice(startIndex, endIndex);

    var tableBody = document.getElementById("studentsTableBody");
    tableBody.innerHTML = '';

    students.forEach(function(student, index) {
        var row = tableBody.insertRow();
        row.insertCell(0).innerHTML = '<input type="checkbox">';
        row.insertCell(1).textContent = student.group;
        row.insertCell(2).textContent = student.name;
        row.insertCell(3).textContent = student.gender;
        row.insertCell(4).textContent = student.birthday;
        row.insertCell(5).textContent = student.status;
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function() {
            deleteStudent(index + startIndex); // Pass the actual index in studentsData
        };
        var cell = row.insertCell(6);
        cell.appendChild(deleteButton);
    });
}

function createStudent() {
    var group = document.getElementById('group').value;
    var fname = document.getElementById('fname').value;
    var lname = document.getElementById('lname').value;
    var gender = document.getElementById('gender').value;
    var bday = document.getElementById('bday').value;

    addStudent(group, fname + ' ' + lname, gender, bday);
}

function addStudent(group, name, gender, birthday) {
    var newStudent = {
        group: group,
        name: name,
        gender: gender,
        birthday: birthday,
        status: "Active"
    };
    studentsData.push(newStudent);
    renderStudents(currentPage);
}

function deleteStudent(index) {
    studentsData.splice(index, 1);
    renderStudents(currentPage);
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderStudents(currentPage);
    }
}

function nextPage() {
    var totalPages = Math.ceil(studentsData.length / studentsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderStudents(currentPage);
    }
}

// Initial render
document.addEventListener("DOMContentLoaded", function() {
    renderStudents(currentPage);
});

