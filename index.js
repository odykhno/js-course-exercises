'use strict';

var MIN_AGE = 1;
var MAX_AGE = 99;
if (localStorage.getItem('studentSequence')) {
  var studentSequence = JSON.parse(localStorage.getItem('studentSequence')).
                      map(function(elem) {
  return parseInt(elem);
  });
}

$(function() {

  // getting elements
  var $studentListingContainer = $('div.student-listing-container').parent();
  var $studentDataContainer = $('div.student-data-container').parent();
  var $studentFormContainer = $('div.student-form-container').parent();
  var $studentTableBody = $('tbody');
  var $divAlertDanger = $('div.alert.alert-danger');
  var $divAlertSuccess = $('div.alert.alert-success');
  var $editOnDataContainer = $studentDataContainer.find('a.btn.btn-primary');
  var $coursesDiv = $('div.student-data-group').has('div.course-group');
  var $studentDataSpans = $('div.student-data-container').find('span');
  var $alertDeleteCreate = $studentListingContainer.find('.alert.alert-success');
  var $divAddCourse = $('a.add-course').parent();

  var isBackToListing; // indicator for correct back returns
  var isStudentUpdated; // indicator for correct back after updating
  var isNewStudent; // indicator for PUT or POST request
  var studentId; // selected student for PUT request

  pageReset();
  $studentDataContainer.hide();
  $studentFormContainer.hide();
  $studentTableBody.empty();
  $divAlertDanger.find('li').remove();

  function fixHelper(e, ui) {
    ui.children().each(function() {
      $(this).width($(this).width());
    });
    return ui;
  };

  // sorting
  $studentTableBody.sortable({
    helper: fixHelper,
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
    $('select.student-age').append(Mustache.render(SELECT_OPTION, {id: i}));
  }

  // delete or clean out unnessesary elems
  function pageReset() {
    $studentDataSpans.empty();
    $coursesDiv.empty();
    $divAlertDanger.hide();
    $divAlertSuccess.hide();
    $('form')[0].reset();
    $('input.form-control.student-course').parent().remove();
    for (var i = 1; i <= 2; i++) {
      $divAddCourse.before(Mustache.render(ADD_COURSE, {number: i, course: ''}));
    }
  }
  
  // loading list from localStorage or server
  function loadStudents() {
    student.getAll(function(students) {
      if (studentSequence) {
        var currentList = _.map(students.data, function(student) { // getting current ids from server
          return student.id;
        });
        studentSequence.push(_.difference(currentList, studentSequence)); // including ids of new students
        _.chain(studentSequence).flatten().pullAll(_.difference(studentSequence, 
                                                   currentList)).value(); //excluding ids of deleted students
        studentSequence = _.flatten(studentSequence);
        $.each(studentSequence, function(index, id) { // loading students in correct order
          $.each(students.data, function(index, student) {
            if (student.id === id) {
              $studentTableBody.append(Mustache.render(STUDENT_ROW_VIEW, student));
            }
          });
        });
      } else {
        $.each(students.data, function(index, student) { // loading students without sorting
          $studentTableBody.append(Mustache.render(STUDENT_ROW_VIEW, student));
        });
      }
    });
  } 

  loadStudents();

  // check existence of student
  function ifStudentIsDeleted() {
    if (confirm('Sorry, this student has already been deleted! ' + 
                'Click "OK" to reload the page')) {
      $studentTableBody.empty();
      loadStudents();
    }
  }
  
  function fillingStudentData(student) {
    $('div.student-data-container').attr('data-id', student.data.id);
    $('span.student-full-name').text(student.data.first_name + ' ' + 
                                     student.data.last_name);
    $('span.student-age').text(student.data.age);
    $('span.student-at-university').text(student.data.at_university ? 'Yes' : 'No');
    $.each(student.data.courses, function(index) {
      $coursesDiv.append(Mustache.render(STUDENT_COURSE_VIEW, 
              {number: index + 1, course: student.data.courses[index]}));
    });  
  }

  // show button handler
  $studentListingContainer.delegate('a.btn.btn-default', 'click', function(event) {
    pageReset();
    student.getStudentById(event.target, ifStudentIsDeleted, function(student) {
      $studentListingContainer.fadeOut(500, function() {
        $studentDataContainer.fadeIn(500);
      });
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
    $('input.form-control.student-course').parent().remove();
    $divAlertDanger.hide();
    isNewStudent = false;
    student.getStudentById(elem, ifStudentIsDeleted, function(student) {
      currentContainer.fadeOut(500, function() {
        $studentFormContainer.fadeIn(500);
        $divAlertSuccess.hide();
      });
      $('input.first-name').val(student.data.first_name);
      $('input.last-name').val(student.data.last_name);
      $('select.student-age').val(student.data.age);
      $('input.student-at-university').prop("checked", student.data.at_university);
      $.each(student.data.courses, function(index) {
        $divAddCourse.before(Mustache.render(ADD_COURSE, {number: index + 1, 
                             course: student.data.courses[index]}));
      });
    });
  }

  // edit button handler on $studentDataContainer
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
    if (confirm('Do you really want to delete this student?')) {
      pageReset();
      student.remove(event.target, ifStudentIsDeleted, function(data) {
        if (data.data) {
          $studentTableBody.find('td[data-id=' + data.data.id + ']').parent().
                                                                     remove();
          $alertDeleteCreate.html('User was successfully deleted').fadeIn(500);
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
    $(this).parent().before(Mustache.render(ADD_COURSE, 
                        {number: $studentCoursesCount.length + 1, course: ''}));
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

function ifDataErrors(data) {
  $divAlertDanger.fadeIn(500);
  $.each(data.errors, function(index, error) {
    $('ul').append(Mustache.render(ERROR_LI, {error: error}));
  });    
}

// submit data (add or update)
  $('form').submit(function(event) {
    $divAlertDanger.find('li').remove();
    if (isNewStudent) {
      student.post(createDataObject(), ifDataErrors, function(data) {
        $studentFormContainer.fadeOut(500, function() {
          $studentListingContainer.fadeIn(500);
          $alertDeleteCreate.html('User was successfully created').fadeIn(500);
          $studentTableBody.append(Mustache.render(STUDENT_ROW_VIEW, data.data));
          isStudentUpdated = false;
        });
      });
    } else {
      var selectedStudent = studentId || $editOnDataContainer.parent().
                                         attr('data-id');
      student.put(selectedStudent, createDataObject(), ifDataErrors, function(data) {
        $studentFormContainer.fadeOut(500, function() {
          $studentDataContainer.fadeIn(500);
          pageReset();
          $('div.alert.alert-success:contains("updated")').fadeIn(500);
          fillingStudentData(data);
          var $updatedTr = $studentTableBody.find('td[data-id=' + data.data.id + 
                                                  ']').parent();
          if ($updatedTr.find('td:last').attr('data-id') === $('tr:last td:last').
                                                             attr('data-id')) {
            $studentTableBody.append(Mustache.render(STUDENT_ROW_VIEW, data.data));
            $updatedTr.remove();
          } else {
            $(Mustache.render(STUDENT_ROW_VIEW, data.data)).insertBefore
                                                            ($updatedTr.next());
            $updatedTr.remove();
          }         
        });
      });
    }
    event.preventDefault();
  });

});
