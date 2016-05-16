'use strict';

var MIN_AGE = 1;
var MAX_AGE = 99;

$(function() {

  // getting elements
  var $studentListingContainer = $('div.student-listing-container').parent();
  var $studentDataContainer = $('div.student-data-container').parent();
  var $studentFormContainer = $('div.student-form-container').parent();
  var $studentTableBody = $('tbody');
  var $coursesDiv = $('div.student-data-group').has('div.course-group');
  var $studentDataSpans = $('div.student-data-container').find('span');
  var $divCourseTemplate = $('div.form-group').has('label:contains("Course 1:")')
                           .clone(true);
  
  $studentDataContainer.hide();
  $studentFormContainer.hide();
  $('div.alert.alert-danger').hide();
  $('div.alert.alert-success').hide();

  // form Select filling
  for (var i = MIN_AGE; i <= MAX_AGE; i++) {
    $('select.student-age').append($('<option>').text(i).val(i));
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
    return $('<tr>').append($firstNameTd, $lastNameTd, $actionsTd);
  }

  function studentCourseView(number, course) {
    var $courseB = $('<b>').html('Course' + number + ': ');
    var $courseSpan = $('<span>').addClass('student-course').text(course);
    return $('<div>').addClass('course-group').append($courseB, $courseSpan);
  }

  $studentTableBody.empty();
  $studentDataSpans.empty();
    
  // loading list from server
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

  // GET request
  function getStudentById(elem, callback) {
    var selectedStudent = $(elem).parent().data('id');
    $.get({
      url: 'https://spalah-js-students.herokuapp.com/students/'+ selectedStudent,
      contentType: 'application/json',
      datatype: 'json',
      success: callback
    });
  }

  // show button handler
  $studentListingContainer.delegate('a.btn.btn-default', 'click', function(event) {
    $studentListingContainer.fadeOut(500, function() {
      $studentDataContainer.fadeIn(500);
    });
    $coursesDiv.empty();
    getStudentById(event.target, function(student) {
      $('span.student-full-name').text(student.data.first_name + ' ' + 
                                       student.data.last_name);
      $('span.student-age').text(student.data.age);
      $('span.student-at-university').text(student.data.at_university ? 'Yes' : 
                                           'No');
      $.each(student.data.courses, function(index) {
        $coursesDiv.append(studentCourseView(index + 1, 
                                             student.data.courses[index]));
      });  
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
  
  // edit button handler on $studentDataContainer
  $studentDataContainer.find('a.btn.btn-primary').click(function(event) {
    $studentDataContainer.fadeOut(500, function() {
      $studentFormContainer.fadeIn(500);
    });
    $('input.first-name').val($('span.student-full-name').text().split(' ')[0]);
    $('input.last-name').val($('span.student-full-name').text().split(' ')[1]);
    $('select.student-age').val($('span.student-age').text());
    $('input.student-at-university').prop("checked", 
                $('span.student-at-university').text() == 'Yes' ? true : false);
    //if ($('span.student-course').length <= 2) {
      $('input.student-course').each(function(index) {
        $(this).val($('span.student-course').map(function() {
          return $(this).text();
        })[index]);
      });  
    //}// сделать отрисовку курсов заново и считывание туда
    event.preventDefault();
  });

  // edit button handler on on $studentListingContainer
  $studentListingContainer.delegate('a.btn.btn-primary', 'click', function(event) {
    $studentListingContainer.fadeOut(500, function() {
      $studentFormContainer.fadeIn(500);
    });
    $('form')[0].reset();// сделать отрисовку курсов заново и считывание туда
    getStudentById(event.target, function(student) {
      $('input.first-name').val(student.data.first_name);
      $('input.last-name').val(student.data.last_name);
      $('select.student-age').val(student.data.age);
      $('input.student-at-university').prop("checked", 
                                    student.data.at_university ? 'Yes' : 'No');
      //if (student.data.courses.length <= 2) {
        $.each(student.data.courses, function(index) {
          $('input.student-course').val(student.data.courses[index]);
        });
      //}
    });
    event.preventDefault();
  });

  // back button handler on $studentFormContainer
  $studentFormContainer.find('a.btn.btn-default').click(function(event) {
  	$studentFormContainer.fadeOut(500, function() {
      $studentDataContainer.fadeIn(500);
    });
    event.preventDefault();
  });

  // adding student
  $studentListingContainer.find('a.btn.btn-success').click(function(event) {
  	$studentListingContainer.fadeOut(500, function() {
      $studentFormContainer.fadeIn(500);
      $('form')[0].reset();
    });
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

  // submit data about new student
  $('form').submit(function(event) {
    var newStudent = createDataObject();
    $.post('https://spalah-js-students.herokuapp.com/students', newStudent);
  });

});