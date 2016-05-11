'use strict';

$(function() {

  // getting elements
  var $studentListingContainer = $('div.student-listing-container').parent();
  var $studentDataContainer = $('div.student-data-container').parent();
  var $studentFormContainer = $('div.student-form-container').parent();
  var $studentTableBody = $('tbody');
  //var $studentDataSpans = ;
  
  $studentDataContainer.hide();
  $studentFormContainer.hide();

  function studentRowView(student) {
    var $firstNameTd = $('<td>').html(student.first_name);
    var $lastNameTd = $('<td>').html(student.last_name);
    var $studentShowAnchor = $('<a>').html('Show').addClass('btn btn-default').attr('href', '#');
    var $studentEditAnchor = $('<a>').html('Edit').addClass('btn btn-primary').attr('href', '#');
    var $studentDeleteAnchor = $('<a>').html('Delete').addClass('btn btn-danger').attr('href', '#');
    var $actionsTd = $('<td>').append($studentShowAnchor, $studentEditAnchor, $studentDeleteAnchor);
    return $('<tr>').attr('student-id', student.id).append($firstNameTd, $lastNameTd, $actionsTd);
  }

  $studentTableBody.empty();
  $('div.student-data-container').find('span').empty();

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
      $('div.student-data-container').find('span.stundent-full-name').text(student.data.first_name + ' ' + student.data.last_name);
      $('div.student-data-container').find('span.student-age').text(student.data.age);
      $('div.student-data-container').find('span.student-at-university').text(student.data.at_university ? 'Yes' : 'No');
      $('div.student-data-container').find('span.student-course').each(function(index) {
        $(this).text(student.data.courses[index]);
      });
    }
  });
});
  
});