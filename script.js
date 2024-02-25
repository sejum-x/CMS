// Initial render
document.addEventListener("DOMContentLoaded", function() {
    renderStudents(currentPage);
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "grid";
    evt.currentTarget.className += " active";
}


var studentsData = [
    { group: "PZ-28", name: "Sofiyka Yaroshovych", gender: "Female", birthday: "2000-01-01", status: "Active" },
    { group: "PZ-28", name: "Nazik Nafta", gender: "Male", birthday: "2000-02-02", status: "Inactive" },
    { group: "PZ-28", name: "Fitia Boem", gender: "Male", birthday: "2000-02-02", status: "Active" },
    { group: "PZ-28", name: "Yurchyk Starosta", gender: "Male", birthday: "2000-02-02", status: "Inactive" },
    { group: "PZ-28", name: "Pes Patron", gender: "Male", birthday: "2000-02-02", status: "Inactive" },
    { group: "PZ-28", name: "Max sah sakh sahk", gender: "Male", birthday: "2000-02-02", status: "Active" },
    { group: "PZ-28", name: "Asiiiiykka", gender: "Male", birthday: "2000-02-02", status: "Inactive" },
];

var currentPage = 1;
var studentsPerPage = 10;

function createStudent() {
    var group = document.getElementById('group').value;
    var fname = document.getElementById('fname').value;
    var lname = document.getElementById('lname').value;
    var gender = document.getElementById('gender').value;
    var bday = document.getElementById('bday').value;

    if (!group || !fname || !lname || !gender || !bday) {
        alert('Please fill in all fields.');
        return;
    }

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
        deleteButton.innerHTML = '<img src="assets/delete_icon_white.svg" alt="Delete Icon" style="width: 16px; height: 16px;">';
        deleteButton.className = "delete-button";
        deleteButton.onclick = function() {
            deleteStudent(index + startIndex);
        };
        var editButton = document.createElement("button");
        editButton.innerHTML = '<img src="assets/edit_icon_white.svg" alt="Edit Icon" style="width: 16px; height: 16px;">';
        editButton.className = "edit-button";
        editButton.onclick = function() {
            editStudent(index + startIndex);
        };
        var spacer = document.createElement("span");
        spacer.style.marginRight = "5px";

        optionsCell.appendChild(deleteButton);
        optionsCell.appendChild(spacer);
        optionsCell.appendChild(editButton);
    });
    updateAllCheckboxes(selectAllCheckbox.checked);
}



var modal = document.getElementById("addModal");
var closeButton = modal.querySelector(".close");
function OpenAddStudentModal() {
    modal.style.display = "block";
}
function CloseAddStudentModal() {
    modal.style.display = "none";
}
closeButton.addEventListener("click", CloseAddStudentModal);

window.addEventListener("click", function(event) {
    if (event.target === modal) {
        CloseAddStudentModal();
    }
});

var selectAllCheckbox = document.querySelector("#studentsTable thead input[type='checkbox']");
selectAllCheckbox.addEventListener('change', function() {
    updateAllCheckboxes(selectAllCheckbox.checked);
});
function updateAllCheckboxes(state) {
    var checkboxes = document.querySelectorAll("#studentsTable tbody input[type='checkbox']");
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = state;
    });
}



var currentDeleteIndex;
function deleteStudent(index) {
    currentDeleteIndex = index;
    OpenDeleteConfirmationModal();
}
function confirmDeleteStudent() {
    studentsData.splice(currentDeleteIndex, 1);
    renderStudents(currentPage);
    CloseDeleteConfirmationModal();
}
function OpenDeleteConfirmationModal() {
    var deleteModal = document.getElementById("deleteModal");
    deleteModal.style.display = "block";
}
function CloseDeleteConfirmationModal() {
    var deleteModal = document.getElementById("deleteModal");
    deleteModal.style.display = "none";
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

var EditModal = document.getElementById("editModal");
var closeButton = EditModal.querySelector(".close");
closeButton.addEventListener("click", CloseEditStudentModal);

window.addEventListener("click", function(event) {
    if (event.target === editModal) {
        CloseEditStudentModal();
    }
});

function updateStudent() {
    var group = document.getElementById('edit-group').value;
    var fname = document.getElementById('edit-fname').value;
    var lname = document.getElementById('edit-lname').value;
    var gender = document.getElementById('edit-gender').value;
    var bday = document.getElementById('edit-bday').value;

    if (!group || !fname || !lname || !gender || !bday) {
        alert('Please fill in all fields.');
        return;
    }

    var editedStudent = {
        group: group,
        name: fname + ' ' + lname,
        gender: gender,
        birthday: bday,
        status: "Active" // not editable
    };

    studentsData[currentEditIndex] = editedStudent;
    renderStudents(currentPage);
    CloseEditStudentModal();
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


window.addEventListener('resize', function() {
    if (window.innerWidth < 600) {
        document.querySelector('#studentsTable th:nth-child(6)').textContent = 'S';
        document.querySelector('#studentsTable th:nth-child(2)').textContent = 'G';
        document.querySelector('#studentsTable th:nth-child(4)').textContent = 'G';
        document.querySelectorAll('#studentsTable td:nth-child(4)').forEach(function(cell) {
            if (cell.textContent.trim() === 'Male') {
                cell.textContent = 'M';
            } else if (cell.textContent.trim() === 'Female') {
                cell.textContent = 'F';
            }
        });
    } else {
        document.querySelector('#studentsTable th:nth-child(6)').textContent = 'Status';
        document.querySelector('#studentsTable th:nth-child(4)').textContent = 'Gender';
        document.querySelector('#studentsTable th:nth-child(2)').textContent = 'Group';
        document.querySelectorAll('#studentsTable td:nth-child(4)').forEach(function(cell) {
            if (cell.textContent.trim() === 'M') {
                cell.textContent = 'Male';
            } else if (cell.textContent.trim() === 'F') {
                cell.textContent = 'Female';
            }
        });
    }
});

