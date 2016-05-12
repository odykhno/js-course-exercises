'use strict';

var MIN_AGE = 1;
var MAX_AGE = 99;

$(function() {

  // getting elements
  var $studentListingContainer = $('div.student-listing-container').parent();
  var $studentDataContainer = $('div.student-data-container').parent();
  var $studentFormContainer = $('div.student-form-container').parent();
  var $studentTableBody = $('tbody');
  var $studentDataSpans = $('div.student-data-container').find('span');
  var $divCourseTemplate = $('div.form-group').has('label:contains("Course 1:")')
                           .clone(true);
  
  $studentDataContainer.hide();
  $studentFormContainer.hide();
  $('div.alert.alert-danger').hide();

  // form Select filling
  for (var i = MIN_AGE; i <= MAX_AGE; i++) {
    $('select.student-age').append($('<option>').text(i).val(i));
  }

  function studentRowView(student) {
    var $firstNameTd = $('<td>').html(student.first_name);
    var $lastNameTd = $('<td>').html(student.last_name);
    var $studentShowAnchor = $('<a>').html('Show').addClass('btn btn-default').attr('href', '#');
    var $studentEditAnchor = $('<a>').html('Edit').addClass('btn btn-primary').attr('href', '#');
    var $studentDeleteAnchor = $('<a>').html('Delete').addClass('btn btn-danger').attr('href', '#');
    var $actionsTd = $('<td>').append($studentShowAnchor, $studentEditAnchor, $studentDeleteAnchor);
    return $('<tr>').attr('student-id', student.id).append($firstNameTd, $lastNameTd, $actionsTd); // remake to data('id', student.id) & remove to td
  }

  $studentTableBody.empty();
  $studentDataSpans.empty();

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

  // show button handler  !!!correct courses count!!!!
  $studentListingContainer.delegate('a.btn.btn-default', 'click', function(event) {
    $studentListingContainer.fadeOut(500, function() {
      $studentDataContainer.fadeIn(500);
    });
    var selectedStudent = $(event.target).closest('tr').attr('student-id');
    $.get({
      url: 'https://spalah-js-students.herokuapp.com/students/'+ selectedStudent,
      contentType: 'application/json',
      datatype: 'json',
      success: function(student) {
        $('span.stundent-full-name').text(student.data.first_name + ' ' + student.data.last_name);
        $('span.student-age').text(student.data.age);
        $('span.student-at-university').text(student.data.at_university ? 'Yes' : 'No');
        $('span.student-course').each(function(index) {
          $(this).text(student.data.courses[index]);
        });
      }
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
    var result = {};
    result.first_name = $('input.first-name').val();
    result.last_name = $('input.last-name').val();
    result.age = $('select.student-age').val();
    result.at_university = $('input.student-at-university').prop("checked");
    result.courses = [];
    $('input.student-course').each(function(index) {
      result.courses.push($(this).val());
    });
    return result;
  }

  // submit data about new student
  $('form').submit(function(event) {
  	console.log(createDataObject());
  	event.preventDefault();
    //$.post('https://spalah-js-students.herokuapp.com/students', createDataObject(), )
  });

});