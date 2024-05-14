/*    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('cashing.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }*/

    document.getElementById('clearCacheButton').addEventListener('click', clearCache);
    function clearCache() {
        caches.open(CACHE_NAME)
            .then(cache => {
                cache.keys().then(keys => {
                    keys.forEach(key => {
                        cache.delete(key);
                    });
                });
            })
            .catch(function(error) {
                console.error('Error clearing cache:', error);
            });
    }
    $(document).ready(function() {
        getAllStudents();
        renderStudents(currentPage);
    });
    function openTab(evt, tabName) {
        $(".tabcontent").hide();
        $(".tablinks").removeClass("active");

        $("#" + tabName).show();
        $(evt.currentTarget).addClass("active");
    }
    class Student {
        constructor(id, group, name, gender, birthday, status) {
            this.id = id;
            this.group = group;
            this.name = name;
            this.gender = gender;
            this.birthday = birthday;
            this.status = status;
        }
    }

    var studentsData = [
        new Student(0,"PZ-28", "Sofiyka Yaroshovych", "Female", "2005-09-30"),
    ];

    var currentPage = 1;
    var studentsPerPage = 10;

    function resetInputBorders() {
        $('#group').css('border', '1px solid hsl(230, 25%, 80%)');
        $('#fname').css('border', '1px solid hsl(230, 25%, 80%)');
        $('#lname').css('border', '1px solid hsl(230, 25%, 80%)');
        $('#gender').css('border', '1px solid hsl(230, 25%, 80%)');
        $('#bday').css('border', '1px solid hsl(230, 25%, 80%)');
    }
    function createStudent() {
        var group = $('#group');
        var fname = $('#fname');
        var lname = $('#lname');
        var gender = $('#gender');
        var bday = $('#bday');

        var allFieldsFilled = true;
        var isValidName = /^[a-zA-Zа-яА-Я]+$/.test(fname.val()) && /^[a-zA-Zа-яА-Я]+$/.test(lname.val());
        var today = new Date();
        var birthdateObj = new Date(bday.val());
        var minBirthdate = new Date();
        minBirthdate.setFullYear(minBirthdate.getFullYear() - 16);
        var isValidAge = birthdateObj <= minBirthdate;

        if (!group.val()) {
            group.css('border', '1px solid red');
            allFieldsFilled = false;
        }
        if (!fname.val() || !isValidName) {
            fname.css('border', '1px solid red');
            allFieldsFilled = false;
        }
        if (!lname.val() || !isValidName) {
            lname.css('border', '1px solid red');
            allFieldsFilled = false;
        }
        if (!gender.val()) {
            gender.css('border', '1px solid red');
            allFieldsFilled = false;
        }
        if (!bday.val()) {
            bday.css('border', '1px solid red');
            allFieldsFilled = false;
        }

        if (!allFieldsFilled) {
            return;
        }

        addStudent(group.val(), fname.val() + ' ' + lname.val(), gender.val(), bday.val());
    }



    function addStudent(group, name, gender, birthday) {
        var newStudent = new Student(0, group, name, gender, birthday, "Active");
        studentsData.push(newStudent);
        sendStudentDataToServer(newStudent);
        getAllStudents();
        renderStudents(currentPage);
    }

    async function sendStudentDataToServer(student) {
        const url = 'https://localhost:7214/api/EduHub';
        const data = JSON.stringify({
            Id: 0,
            Group: student.group,
            Name: student.name,
            Gender: student.gender,
            Birthday: student.birthday,
            Status: student.status,
            Email: 'email@gmail.com',
            Password: 'Password123',
        });

        console.log('Sending data:', data);
        console.log('URL:', url);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        };

        try {
            const response = await fetch(url, options);
            if (response.ok) {
                const info = await response.json();
                console.log('Student added successfully:', info);
            } else {
                const error = await response.text();
                console.error('Error:', error);
                let parsedError = JSON.parse(error);
                $('#errorMessage').text(parsedError.message);
                $('#errorModal').show();
            }
        } catch (error) {
            console.error('Error:', error);
            let parsedError = JSON.parse(error);
            $('#errorMessage').text(parsedError.message);
            $('#errorModal').show();
        }
    }

    function closeErrorModal() {
        $('#errorModal').hide();
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
        resetInputBorders()
        var modal = $('#studentModal');
        modal.attr('data-mode', 'add');
        $('#modalTitle').text('Add Student');
        $('.confirmStudentBt').text('Create');
        modal.css('display', 'block');
    }

    function openEditStudentModal(index) {
        resetInputBorders();
        var student = studentsData[index];
        currentEditIndex = index;

        var modal = $('#studentModal');
        modal.attr('data-mode', 'edit');
        $('#modalTitle').text('Edit Student');
        $('.confirmStudentBt').text('Update');

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

    function updateStudent() {
        var group = $('#group');
        var fname = $('#fname');
        var lname = $('#lname');
        var gender = $('#gender');
        var bday = $('#bday');

        var allFieldsFilled = true;
        var isValidName = /^[a-zA-Zа-яА-Я]+$/.test(fname.val()) && /^[a-zA-Zа-яА-Я]+$/.test(lname.val());
        var today = new Date();
        var birthdateObj = new Date(bday.val());
        var minBirthdate = new Date();
        minBirthdate.setFullYear(minBirthdate.getFullYear() - 16);
        var isValidAge = birthdateObj <= minBirthdate;

        if (!group.val()) {
            group.css('border', '1px solid red');
            allFieldsFilled = false;
        } else {
            group.css('border', '1px solid hsl(230, 25%, 80%)');
        }
        if (!fname.val() || !isValidName) {
            fname.css('border', '1px solid red');
            allFieldsFilled = false;
        } else {
            fname.css('border', '1px solid hsl(230, 25%, 80%)');
        }
        if (!lname.val() || !isValidName) {
            lname.css('border', '1px solid red');
            allFieldsFilled = false;
        } else {
            lname.css('border', '1px solid hsl(230, 25%, 80%)');
        }
        if (!gender.val()) {
            gender.css('border', '1px solid red');
            allFieldsFilled = false;
        } else {
            gender.css('border', '1px solid hsl(230, 25%, 80%)');
        }
        if (!bday.val() || !isValidAge) {
            bday.css('border', '1px solid red');
            allFieldsFilled = false;
        } else {
            bday.css('border', '1px solid hsl(230, 25%, 80%)');
        }

        if (!allFieldsFilled) {
            return;
        }

        var student = studentsData[currentEditIndex];
        student.group = group.val();
        student.name = fname.val() + ' ' + lname.val();
        student.gender = gender.val();
        student.birthday = bday.val();

        updateStudentOnServer(student);
        renderStudents(currentPage);
    }

    async function updateStudentOnServer(student) {
        var url = 'https://localhost:7214/api/EduHub/' + student.id;

        var data = JSON.stringify({
            Id: student.id,
            Group: student.group,
            Name: student.name,
            Gender: student.gender,
            Birthday: student.birthday,
            Status: student.status,
            Email: 'email@gmail.com',
            Password: 'Password123',
        });

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        };

        try {
            const response = await fetch(url, options);
            if (response.ok) {
                console.log('Student updated successfully');
            } else {
                const error = await response.text();
                console.error('Error:', error);
                let parsedError = JSON.parse(error);
                $('#errorMessage').text(parsedError.message);
                $('#errorModal').show();
            }
        } catch (error) {
            console.error('Error:', error);
            let parsedError = JSON.parse(error);
            $('#errorMessage').text(parsedError.message);
            $('#errorModal').show();
        }
    }


    function closeStudentModal() {
        modal.fadeOut(400, function() {
            modal.find('input[type="text"], input[type="date"], select').val('');
        });
    }

    closeButton.on('click', closeStudentModal);

    function closeDeleteModal() {
        $('#deleteModal').hide();
    }

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






    //delete all students
    function deleteAllStudents() {
        var url = 'https://localhost:7214/api/EduHub/all';

        fetch(url, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('All students deleted successfully');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    document.getElementById('deleteAllStudentsButton').addEventListener('click', deleteAllStudents);

    // Function to fetch all students
    function getAllStudents() {
        var url = 'https://localhost:7214/api/EduHub';

        fetch(url)
            .then(response => response.json())
            .then(data => {
                studentsData = [];
                data.forEach(student => {
                    studentsData.push(new Student(student.id, student.group, student.name, student.gender, student.birthday, student.status));
                });
                renderStudents(currentPage);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    document.getElementById('getAllStudentsButton').addEventListener('click', getAllStudents);


    // Функція для видалення студента з сервера
    function deleteStudent(index) {
        var studentId = studentsData[index].id;
        var url = 'https://localhost:7214/api/EduHub/' + studentId; // Правильний URL до вашого веб-сервера

        fetch(url, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                studentsData.splice(index, 1);

                renderStudents(currentPage);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function updateDeleteButtonEventHandlers() {
        $('.delete-button').off('click');

        $('.delete-button').on('click', function() {
            var index = $(this).closest('tr').index();
            deleteStudent(index);
        });
    }

    $(document).ready(function() {
        renderStudents(currentPage);
        updateDeleteButtonEventHandlers(); // Додамо обробники подій для кнопок видалення при завантаженні сторінки
    });

    document.getElementById('message-btn').addEventListener('click', function() {
        var studentsTable = document.getElementById('tableContainer');
        var chatInterface = document.getElementById('chatContainer');
        var taskInterface = document.getElementById('taskContainer');

        studentsTable.style.display = 'none';
        taskInterface.style.display = 'none';
        chatInterface.style.display = 'block';
    });

document.getElementById('taskLink').addEventListener('click', function() {
    var studentsTable = document.getElementById('tableContainer');
    var chatInterface = document.getElementById('chatContainer');
    var taskInterface = document.getElementById('taskContainer');

    studentsTable.style.display = 'none';
    chatInterface.style.display = 'none';
    taskInterface.style.display = 'block';
});

document.getElementById('tableLink').addEventListener('click', function() {
    var studentsTable = document.getElementById('tableContainer');
    var chatInterface = document.getElementById('chatContainer');
    var taskInterface = document.getElementById('taskContainer');

    chatInterface.style.display = 'none';
    taskInterface.style.display = 'none';
    studentsTable.style.display = 'block';
});


document.getElementById('joinChatBtn').addEventListener('click', function() {
        document.getElementById('joinChatPanel').style.display = 'block';
    });