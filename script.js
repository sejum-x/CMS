// Initial render
document.addEventListener("DOMContentLoaded", function() {
    renderStudents(currentPage);
});

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
    document.getElementById(tabName).style.display = "grid";
    evt.currentTarget.className += " active";
}


var studentsData = [
    { group: "A", name: "Sofiyka Yaroshovych", gender: "Female", birthday: "2000-01-01", status: "Active" },
    { group: "B", name: "Nazik Nafta", gender: "Male", birthday: "2000-02-02", status: "Inactive" },
    { group: "B", name: "Fitia Boem", gender: "Male", birthday: "2000-02-02", status: "Active" },
    { group: "B", name: "Yurchyk Starosta", gender: "Male", birthday: "2000-02-02", status: "Inactive" },
    { group: "B", name: "Pes Patron", gender: "Male", birthday: "2000-02-02", status: "Inactive" },
    { group: "B", name: "Max sah sakh sahk", gender: "Male", birthday: "2000-02-02", status: "Active" },
    { group: "B", name: "Asiiiiykka", gender: "Male", birthday: "2000-02-02", status: "Inactive" },
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

        var statusCell = row.insertCell(5);
        var statusIndicator = document.createElement("span");
        statusIndicator.className = student.status === "Active" ? "status-active" : "status-inactive";
        statusIndicator.title = student.status;
        statusCell.appendChild(statusIndicator);

        var optionsCell = row.insertCell(6);
        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<img src="assets/delete_icon.svg" alt="Delete Icon" style="width: 16px; height: 16px;">';
        deleteButton.onclick = function() {
            deleteStudent(index + startIndex);
        };
        var editButton = document.createElement("button");
        editButton.innerHTML = '<img src="assets/edit_icon.svg" alt="Edit Icon" style="width: 16px; height: 16px;">';
        editButton.onclick = function() {
            editStudent(index + startIndex);
        };
        var spacer = document.createElement("span");
        spacer.style.marginRight = "5px";

        optionsCell.appendChild(deleteButton);
        optionsCell.appendChild(spacer);
        optionsCell.appendChild(editButton);
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

function editStudent(index) {
    currentEditIndex = index;
    var student = studentsData[index];
    document.getElementById('edit-group').value = student.group;
    var nameParts = student.name.split(' ');
    document.getElementById('edit-fname').value = nameParts[0];
    document.getElementById('edit-lname').value = nameParts.slice(1).join(' ');
    document.getElementById('edit-gender').value = student.gender;
    document.getElementById('edit-bday').value = student.birthday;

    OpenEditStudentModal();
}


function OpenEditStudentModal() {
    var editModal = document.getElementById("editModal");
    editModal.style.display = "block";
}

function CloseEditStudentModal() {
    var editModal = document.getElementById("editModal");
    editModal.style.display = "none";
}

function updateStudent() {
    var group = document.getElementById('edit-group').value;
    var fname = document.getElementById('edit-fname').value;
    var lname = document.getElementById('edit-lname').value;
    var gender = document.getElementById('edit-gender').value;
    var bday = document.getElementById('edit-bday').value;

    var editedStudent = {
        group: group,
        name: fname + ' ' + lname,
        gender: gender,
        birthday: bday,
        status: "Active" // Assuming status is not editable in the modal
    };

    studentsData[currentEditIndex] = editedStudent; // Assuming currentEditIndex is the index of the student being edited
    renderStudents(currentPage);
    CloseEditStudentModal();
}



// function editStudent(index) {
//     console.log("Editing student at index:", index);
// }



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