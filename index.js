'use strict';

var MIN_AGE = 16;
var MAX_AGE = 70;

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
  var isNewStudent; // indicator for PUT or POST request
  var studentId; // selected student for PUT request
  
  $studentDataContainer.hide();
  $studentFormContainer.hide();
  $divAlertDanger.hide();
  $('div.alert.alert-success').hide();

  // form Select filling
  for (var i = MIN_AGE; i <= MAX_AGE; i++) {
    $('select.student-age').append($('<option>').text(i).val(i));
  }

  // delete or clean out unnessesary elems !!! дописать!!!
  function pageReset() {
    $studentDataSpans.empty();
    $coursesDiv.empty();
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
    var $actionsTd = $('<td>').data('id', student.id).append($studentShowAnchor, 
                                    $studentEditAnchor, $studentDeleteAnchor);
    return $('<tr>').data('id', student.id).append($firstNameTd, $lastNameTd, $actionsTd);
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

  $studentTableBody.empty();
  $divAlertDanger.find('li').remove();
  window.localStorage.clear();
  
  // loading list from localStorage or server
  if (localStorage.getItem('studentsOrder')) {
    var order = localStorage.getItem('studentsOrder').split(',');
    $.get({
      url: 'https://spalah-js-students.herokuapp.com/students',
      contentType: 'application/json',
      datatype: 'json',
      success: function(students) {
        for (var i = 0; i < order.length; i++) {
          $studentTableBody.append(studentRowView(students.data[order[i] - 2]));
        }
      }
    });
  } else {
    $.get({
      url: 'https://spalah-js-students.herokuapp.com/students',
      contentType: 'application/json',
      datatype: 'json',
      success: function(students) {
        $.each(students.data, function(index, student) {
          $studentTableBody.append(studentRowView(student));
        });
      }
    });
  }

  $studentTableBody.sortable();

  // GET request by Id
  function getStudentById(elem, callback) {
    var selectedStudent = $(elem).parent().data('id');
    $.get({
      url: 'https://spalah-js-students.herokuapp.com/students/'+ selectedStudent,
      contentType: 'application/json',
      datatype: 'json',
      success: callback
    });
  }
  
  function fillingStudentData(student) {
    $('div.student-data-container').data('id', student.data.id);
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
      fillingStudentData(student);
    });
    event.preventDefault();
  });

  // back button handler on $studentDataContainer при возврате после эдита обновить список!
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
    $('form')[0].reset();
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

  // edit button handler on $studentDataContainer
  $editOnDataContainer.click(function(event) {
    editHandler($studentDataContainer, $editOnDataContainer);
    isBackToListing = false;
    event.preventDefault();
  });

  // edit button handler on $studentListingContainer
  $studentListingContainer.delegate('a.btn.btn-primary', 'click', function(event) {
    editHandler($studentListingContainer, event.target);
    studentId = $(event.target).parent().data('id');
    isBackToListing = true;
    event.preventDefault();
  });

  // delete student
  $studentListingContainer.delegate('a.btn.btn-danger', 'click', function(event) {
    var selectedStudent = $(event.target).parent().data('id');
    var $deletedTr = $(event.target).closest('tr');
    if (confirm('Do you really want to delete this student?')) {
      $.ajax({
        url: 'https://spalah-js-students.herokuapp.com/students/' + selectedStudent,
        type: 'DELETE', 
        success: function(data) {
          if (data.data) {
            $deletedTr.remove();
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
      $('form')[0].reset();
      $divAlertDanger.hide();
    });
    isNewStudent = true;   // добавить обновление формы(2 курса, не 3)
    isBackToListing = true;
    var studentsOrder = [];
    var $studentsOrder = $studentTableBody.find('tr').map(function(index) {
      return $(this).data('id');
    });
    $studentsOrder.each(function(index) {
      studentsOrder.push($studentsOrder[index]);
    });
    localStorage.setItem('studentsOrder', studentsOrder);
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
    var result = {student: {}};
    result.student.first_name = $('input.first-name').val();
    result.student.last_name = $('input.last-name').val();
    result.student.age = $('select.student-age').val();
    result.student.at_university = $('input.student-at-university').prop("checked");
    result.student.courses = [];
    $('input.student-course').each(function(index) {
      result.student.courses.push($(this).val());
    });
    return result;
  }

  // submit data (add or update)     !!!объединить пут и пост в одну функцию!!!
  $('form').submit(function(event) {
    $divAlertDanger.find('li').remove();
    if (isNewStudent) {
      $.post('https://spalah-js-students.herokuapp.com/students', createDataObject(), 
           function(data) {
        if (data.errors) {
          $divAlertDanger.fadeIn(500);
          $.each(data.errors, function(index, error) {
            var $error_li = $('<li>').addClass('list-group-item').text(error);
            $('ul').append($error_li);
          });    
        } else {
          $studentFormContainer.fadeOut(500, function() {
            $studentListingContainer.fadeIn(500);
            $('div.alert.alert-success:contains("created")').fadeIn(500);
            $studentTableBody.append(studentRowView(data.data));
          });
        }
      });
    } else {
      var selectedStudent = $editOnDataContainer.parent().data('id') || studentId;
      $.ajax({
        url: 'https://spalah-js-students.herokuapp.com/students/' + selectedStudent,
        type: 'PUT',
        data: createDataObject(),
        success: function(data) {
          if (data.errors) {
            $divAlertDanger.fadeIn(500);
            $.each(data.errors, function(index, error) {
              var $error_li = $('<li>').addClass('list-group-item').text(error);
              $('ul').append($error_li);
            });    
          } else {
            $studentFormContainer.fadeOut(500, function() {
              $studentDataContainer.fadeIn(500);
              $('div.alert.alert-success:contains("updated")').fadeIn(500);
              pageReset();
              fillingStudentData(data);
            });
          }
        }
      }); 
    } 
    event.preventDefault();
  });

});
