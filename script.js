$(document).ready(function() {
    renderStudents(currentPage);
});

function openTab(evt, tabName) {
    $(".tabcontent").hide();
    $(".tablinks").removeClass("active");

    $("#" + tabName).show();
    $(evt.currentTarget).addClass("active");
}

class Student {
    static idCounter = 0;

    constructor(group, name, gender, birthday, status = "Active") {
        this.id = Student.idCounter++;
        this.group = group;
        this.name = name;
        this.gender = gender;
        this.birthday = birthday;
        this.status = status;
    }
}

var studentsData = [
    new Student("PZ-28", "Sofiyka Yaroshovych", "Female", "2005-09-30"),
    new Student("PZ-28", "Nazik Nafta", "Male", "2000-02-02", "Inactive"),
];

var currentPage = 1;
var studentsPerPage = 10;

function createStudent() {
    var group = $('#group').val();
    var fname = $('#fname').val();
    var lname = $('#lname').val();
    var gender = $('#gender').val();
    var bday = $('#bday').val();

    if (!group || !fname || !lname || !gender || !bday) {
        alert('Please fill in all fields.');
        return;
    }

    addStudent(group, fname + ' ' + lname, gender, bday);
}

function addStudent(group, name, gender, birthday) {
    var newStudent = new Student(group, name, gender, birthday);
    studentsData.push(newStudent);
    sendStudentDataToServer(newStudent);
    renderStudents(currentPage);
}

function sendStudentDataToServer(student) {
    var url = 'https://localhost:7123/EduHub';

    var data = JSON.stringify({
        Id: (student.id).toString(),
        Group: student.group,
        Name: student.name,
        Gender: student.gender,
        Birthday: student.birthday,
        Status: student.status
    });

    console.log(data);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })
}




function renderStudents(page) {
    var startIndex = (page - 1) * studentsPerPage;
    var endIndex = startIndex + studentsPerPage;
    var students = studentsData.slice(startIndex, endIndex);

    var tableBody = $('#studentsTableBody');
    tableBody.empty();

    students.forEach(function(student, index) {
        var row = $('<tr></tr>');
        row.append('<td><input type="checkbox"></td>');
        row.append('<td>' + student.group + '</td>');
        row.append('<td>' + student.name + '</td>');
        row.append('<td>' + student.gender + '</td>');
        row.append('<td>' + student.birthday + '</td>');

        var statusCell = $('<td></td>');
        var statusIndicator = $('<span></span>');
        statusIndicator.addClass(student.status === "Active" ? "status-active" : "status-inactive");
        statusIndicator.attr('title', student.status);
        statusCell.append(statusIndicator);

        var optionsCell = $('<td></td>');
        var deleteButton = $('<button><img src="assets/delete_icon_white.svg" alt="Delete Icon" style="width: 16px; height: 16px;"></button>');
        deleteButton.addClass("delete-button");
        deleteButton.on('click', function() {
            deleteStudent(index + startIndex);
        });
        var editButton = $('<button><img src="assets/edit_icon_white.svg" alt="Edit Icon" style="width: 16px; height: 16px;"></button>');
        editButton.addClass("edit-button");
        // Update the edit button click handler to pass the index to openEditStudentModal
        editButton.on('click', function() {
            var index = $(this).parent().parent().index();
            openEditStudentModal(index);
        });
        var spacer = $('<span></span>');
        spacer.css('margin-right', '5px');

        optionsCell.append(deleteButton);
        optionsCell.append(spacer);
        optionsCell.append(editButton);

        row.append(statusCell);
        row.append(optionsCell);

        tableBody.append(row);
    });
    updateAllCheckboxes(selectAllCheckbox.prop('checked'));
}

var modal = $('#studentModal');
var closeButton = modal.find(".close");

function openAddStudentModal() {
    var modal = $('#studentModal');
    modal.attr('data-mode', 'add');
    $('#modalTitle').text('Add Student');
    $('.confirmStudentBt').text('Create');
    modal.css('display', 'block');
}

function openEditStudentModal(index) {
    var student = studentsData[index];
    currentEditIndex = index; // Set the currentEditIndex here

    var modal = $('#studentModal');
    modal.attr('data-mode', 'edit');
    $('#modalTitle').text('Edit Student');
    $('.confirmStudentBt').text('Update');

    // Populate the fields with the student data
    $('#group').val(student.group);
    var nameParts = student.name.split(' ');
    $('#fname').val(nameParts[0]);
    $('#lname').val(nameParts.slice(1).join(' '));
    $('#gender').val(student.gender);
    $('#bday').val(student.birthday);

    modal.css('display', 'block');
}

function submitStudent() {
    var modal = $('#studentModal');
    var mode = modal.attr('data-mode');
    if (mode === 'add') {
        createStudent();
    } else if (mode === 'edit') {
        updateStudent();
    }
}

function closeStudentModal() {
    modal.fadeOut(400, function() {
        // Clear input fields
        modal.find('input[type="text"], input[type="date"], select').val('');
    });
}

closeButton.on('click', closeStudentModal);

$(window).on('click', function(event) {
    if (event.target === modal.get(0)) {
        closeStudentModal();
    }
});

var selectAllCheckbox = $('#studentsTable thead input[type="checkbox"]');
selectAllCheckbox.on('change', function() {
    updateAllCheckboxes(selectAllCheckbox.prop('checked'));
});
function updateAllCheckboxes(state) {
    var checkboxes = $('#studentsTable tbody input[type="checkbox"]');
    checkboxes.prop('checked', state);
}

var currentDeleteIndex;
function deleteStudent(index) {
    currentDeleteIndex = index;
    openDeleteConfirmationModal();
}
function confirmDeleteStudent() {
    studentsData.splice(currentDeleteIndex, 1);
    renderStudents(currentPage);
    closeDeleteConfirmationModal();
}
function openDeleteConfirmationModal() {
    var deleteModal = $('#deleteModal');
    deleteModal.css('display', 'block');
}
function closeDeleteConfirmationModal() {
    var deleteModal = $('#deleteModal');
    deleteModal.css('display', 'none');
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

$(window).on('resize', function() {
    if (window.innerWidth < 600) {
        $('#studentsTable th:nth-child(6)').text('S');
        $('#studentsTable th:nth-child(2)').text('G');
        $('#studentsTable th:nth-child(4)').text('G');
        $('#studentsTable td:nth-child(4)').each(function() {
            var cell = $(this);
            if (cell.text().trim() === 'Male') {
                cell.text('M');
            } else if (cell.text().trim() === 'Female') {
                cell.text('F');
            }
        });
    } else {
        $('#studentsTable th:nth-child(6)').text('Status');
        $('#studentsTable th:nth-child(4)').text('Gender');
        $('#studentsTable th:nth-child(2)').text('Group');
        $('#studentsTable td:nth-child(4)').each(function() {
            var cell = $(this);
            if (cell.text().trim() === 'M') {
                cell.text('Male');
            } else if (cell.text().trim() === 'F') {
                cell.text('Female');
            }
        });
    }
});




// Function to fetch all students
function getAllStudents() {
    var url = 'https://localhost:7123/EduHub';

    fetch(url)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Add click event listener to the button
document.getElementById('getAllStudentsButton').addEventListener('click', getAllStudents);

// Function to clear all students
document.getElementById('clearStudentsButton').addEventListener('click', function() {
    fetch('https://localhost:7123/EduHub/ClearAllStudents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                alert('All students have been cleared.');
            } else {
                alert('Failed to clear students.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while clearing students.');
        });
});
