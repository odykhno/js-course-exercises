'use strict';

var MIN_AGE = 1;
var MAX_AGE = 99;
var studentSequence = JSON.parse(localStorage.getItem('studentSequence')).
                      map(function(elem) {
  return parseInt(elem);
});
var URL = 'https://spalah-js-students.herokuapp.com/students';

$(function() {

  // getting elements
  var $studentListingContainer = $('div.student-listing-container').parent();
  var $studentDataContainer = $('div.student-data-container').parent();
  var $studentFormContainer = $('div.student-form-container').parent();
  var $studentTableBody = $('tbody');
  var $divAlertDanger = $('div.alert.alert-danger');
  var $editOnDataContainer = $studentDataContainer.find('a.btn.btn-primary');
  var $coursesDiv = $('div.student-data-group').has('div.course-group');
  var $studentDataSpans = $('div.student-data-container').find('span');
  var $divCourseTemplate = $('div.form-group').has('label:contains("Course 1:")')
                           .clone(true);
  var isBackToListing; // indicator for correct back returns
  var isStudentUpdated; // indicator for correct back after udating
  var isNewStudent; // indicator for PUT or POST request
  var studentId; // selected student for PUT request

  pageReset();
  $studentDataContainer.hide();
  $studentFormContainer.hide();
  $studentTableBody.empty();
  $divAlertDanger.find('li').remove();
  //window.localStorage.clear();

  // sortable !!!ширину строк пофиксить
  $studentTableBody.sortable({
    deactivate: function(event, ui) {
      var studentSequence = [];
      $.each($('tbody tr td:last-child'), function(index, td) {
        studentSequence.push($(td).attr('data-id'));
      });
      localStorage.setItem('studentSequence', JSON.stringify(studentSequence));
    }
  });

  // form Select filling
  for (var i = MIN_AGE; i <= MAX_AGE; i++) {
    $('select.student-age').append($('<option>').text(i).val(i));
  }

  // delete or clean out unnessesary elems !!! протестить!!!
  function pageReset() {
    $studentDataSpans.empty();
    $coursesDiv.empty();
    $divAlertDanger.hide();
    $('div.alert.alert-success').hide();
    $('form')[0].reset();
    $('input.form-control.student-course').parent().remove();
    for (var i = 1; i <= 2; i++) {
      formStudentCourseView(i, '');
    }
  }

  function studentRowView(student) {
    var $firstNameTd = $('<td>').html(student.first_name);
    var $lastNameTd = $('<td>').html(student.last_name);
    var $studentShowAnchor = $('<a>').html('Show').addClass('btn btn-default').
                             attr('href', '#');
    var $studentEditAnchor = $('<a>').html('Edit').addClass('btn btn-primary').
                             attr('href', '#');
    var $studentDeleteAnchor = $('<a>').html('Delete').addClass('btn btn-danger').
                             attr('href', '#');
    var $actionsTd = $('<td>').attr('data-id', student.id).append
                ($studentShowAnchor, $studentEditAnchor, $studentDeleteAnchor);
    return $('<tr>').append($firstNameTd, $lastNameTd, $actionsTd);
  }

  function studentCourseView(number, course) {
    var $courseB = $('<b>').html('Course' + number + ': ');
    var $courseSpan = $('<span>').addClass('student-course').text(course);
    return $('<div>').addClass('course-group').append($courseB, $courseSpan);
  }

  function formStudentCourseView(number, course) {
    var $newCourse = $divCourseTemplate.clone(true);
    $newCourse.children('label').text('Course ' + number + ':');
    $newCourse.children('input').val(course);
    return $('a.add-course').parent().before($newCourse);
  }
  
  // loading list from localStorage or server
  $.get({
    url: URL,
    contentType: "application/json",
    dataType: 'json',
    success: function(students) {
      var currentList = []; // getting current ids from server
      $.each(students.data, function(index, student) {
        currentList.push(student.id);
      });
      if (studentSequence) {
        $.each(studentSequence, function(index) { // excluding id of deleted student
          if (currentList.indexOf(studentSequence[index]) == -1) {
            studentSequence.splice(index, 1);
          }
        });
        $.each(students.data, function(index, student) { // including id of new student
          if (studentSequence.indexOf(student.id) == -1) {
            studentSequence.push(student.id);
          }
        });
        $.each(studentSequence, function(index, id) { // loading students in correct order
          $.each(students.data, function(index, student) {
            if (student.id === id) {
              $studentTableBody.append(studentRowView(student));
            }
          });
        });
      } else {
        $.each(students.data, function(index, student) { // loading students without sorting
          $studentTableBody.append(studentRowView(student));
        });
      }
    }
  });
   
  // GET request by Id
  function getStudentById(elem, callback) {
    var selectedStudent = $(elem).parent().data('id');
    $.get({
      url: URL + '/'+ selectedStudent,
      contentType: 'application/json',
      datatype: 'json',
      success: callback
    });
  }
  
  function fillingStudentData(student) {
    $('span.student-full-name').text(student.data.first_name + ' ' + 
                                     student.data.last_name);
    $('span.student-age').text(student.data.age);
    $('span.student-at-university').text(student.data.at_university ? 'Yes' : 'No');
    $.each(student.data.courses, function(index) {
      $coursesDiv.append(studentCourseView(index + 1, student.data.courses[index]));
    });  
  }

  // show button handler
  $studentListingContainer.delegate('a.btn.btn-default', 'click', function(event) {
    $studentListingContainer.fadeOut(500, function() {
      $studentDataContainer.fadeIn(500);
    });
    pageReset();
    getStudentById(event.target, function(student) {
      $('div.student-data-container').attr('data-id', student.data.id);
      fillingStudentData(student);
    });
    event.preventDefault();
  });

  // back button handler on $studentDataContainer
  $studentDataContainer.find('a.btn.btn-default').click(function(event) {
    $studentDataContainer.fadeOut(500, function() {
      $studentListingContainer.fadeIn(500);
    });
    event.preventDefault();
  });

  function editHandler(currentContainer, elem) {
    currentContainer.fadeOut(500, function() {
      $studentFormContainer.fadeIn(500);
    });
    $('input.form-control.student-course').parent().remove();
    isNewStudent = false;
    getStudentById(elem, function(student) {
      $('input.first-name').val(student.data.first_name);
      $('input.last-name').val(student.data.last_name);
      $('select.student-age').val(student.data.age);
      $('input.student-at-university').prop("checked", student.data.at_university);
      $.each(student.data.courses, function(index) {
        formStudentCourseView(index + 1, student.data.courses[index]);
      });
    });
  }

  // edit button handler on $studentDataContainer  !!!неправильно работает ID после show - разобраться!!!
  $editOnDataContainer.click(function(event) {
    editHandler($studentDataContainer, $editOnDataContainer);
    studentId = null;
    isBackToListing = false;
    event.preventDefault();
  });

  // edit button handler on $studentListingContainer
  $studentListingContainer.delegate('a.btn.btn-primary', 'click', function(event) {
    editHandler($studentListingContainer, event.target);
    studentId = $(event.target).parent().attr('data-id');
    isBackToListing = true;
    event.preventDefault();
  });

  // delete student
  $studentListingContainer.delegate('a.btn.btn-danger', 'click', function(event) {
    var selectedStudent = $(event.target).parent().attr('data-id');
    if (confirm('Do you really want to delete this student?')) {
      $.ajax({
        url: URL + '/' + selectedStudent,
        type: 'DELETE', 
        success: function(data) {
          if (data.data) {
            $studentTableBody.find('td[data-id=' + data.data.id + ']').parent().
                                                                       remove();
          }
        }
      });
    }
    event.preventDefault();
  });

  // back button handler on $studentFormContainer
  $studentFormContainer.find('a.btn.btn-default').click(function(event) {
    $studentFormContainer.fadeOut(500, function() {
      if (isBackToListing) {
        $studentListingContainer.fadeIn(500);
      } else {
        $studentDataContainer.fadeIn(500);
      }
    });
    event.preventDefault();
  });

  // adding student
  $studentListingContainer.find('a.btn.btn-success').click(function(event) {
    $studentListingContainer.fadeOut(500, function() {
      $studentFormContainer.fadeIn(500);
      pageReset();
    });
    isNewStudent = true;
    isBackToListing = true;
    event.preventDefault();
  });

  // adding course
  $('a.add-course').click(function(event) {
    var $studentCoursesCount = $('input.student-course');
    var $newCourse = $divCourseTemplate.clone(true);
    $newCourse.children('label').text('Course ' + 
                                     ($studentCoursesCount.length + 1) + ':');
    $(this).parent().before($newCourse);
    event.preventDefault();
  });

  // removing course
  $studentFormContainer.delegate('a.remove-course', 'click', function(event) {
    var $deletedNumber = $(event.target).parent().children('label').text()[7];
    $(event.target).parent().remove();
    updateNumeration($deletedNumber);
    event.preventDefault();
  });

  function updateNumeration(deletedNumber) {
    var $studentCoursesCount = $('input.student-course');
    $('div.form-group label:contains("Course ")').each(function(index) {
      if (index >= deletedNumber - 1) {
        $(this).text('Course ' + (index + 1) + ':');
      }
    });
  }

  function createDataObject() {
    var student = {};
    student.first_name = $('input.first-name').val();
    student.last_name = $('input.last-name').val();
    student.age = $('select.student-age').val();
    student.at_university = $('input.student-at-university').prop("checked");
    student.courses = [];
    $('input.student-course').each(function(index) {
      student.courses.push($(this).val());
    });
    return {student};
  }

  function submitRequest(url, type, callback) {
    $.ajax({
      url: url,
      type: type,
      data: createDataObject(),
      success: function(data) {
        if (data.errors) {
          $divAlertDanger.fadeIn(500);
          $.each(data.errors, function(index, error) {
            var $error_li = $('<li>').addClass('list-group-item').text(error);
            $('ul').append($error_li);
          });    
        } else {
          callback(data);
        }
      }
    }); 
  }

  // submit data (add or update)
  $('form').submit(function(event) {
    $divAlertDanger.find('li').remove();
    if (isNewStudent) {
      submitRequest(URL, 'POST', function(data) {
        $studentFormContainer.fadeOut(500, function() {
          $studentListingContainer.fadeIn(500);
          $('div.alert.alert-success:contains("created")').fadeIn(500);
          $studentTableBody.append(studentRowView(data.data));
          isStudentUpdated = false;
        });
      });
    } else {
      var selectedStudent = studentId || $editOnDataContainer.parent().data('id');
      submitRequest(URL + '/' + selectedStudent, 'PUT', function(data) {
        $studentFormContainer.fadeOut(500, function() {
          $studentDataContainer.fadeIn(500);
          pageReset();
          $('div.alert.alert-success:contains("updated")').fadeIn(500);
          fillingStudentData(data);
          var $updatedTr = $studentTableBody.find('td[data-id=' + data.data.id + 
                                                  ']').parent();
          if ($updatedTr.find('td:last').attr('data-id') === $('tr:last td:last').
                                                             attr('data-id')) {
            $studentTableBody.append(studentRowView(data.data));
            $updatedTr.remove();
          } else {
            studentRowView(data.data).insertBefore($updatedTr.next());
            $updatedTr.remove();
          }         
        });
      });
    } 
    event.preventDefault();
  });

});

