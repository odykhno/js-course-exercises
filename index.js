'use strict';

var MIN_AGE = 1;
var MAX_AGE = 99;

$(function() {
  
  // getting elements
  var $studentAgeSelect = $('select');
  var $addCourse = $('a.add-course');
  var $studentNameInput = $('input.student-name');
  var $studentAtUniversityCheckbox = $('input.student-at-university');
  var $form = $('form');
  var $formDiv = $('div.column').has('form');
  var $divData = $('div.right-column');
  var $dataSpans = $('span');
  var $divCourseTemplate = $('div.form-group').has('label:contains("Course 1:")')
                           .clone(true);
                           
  $divData.css({'opacity': '0', 'position': 'relative'});
  $dataSpans.css('opacity', '0');
  
  addListeners();
  
  // form Select filling
  for (var i = MIN_AGE; i <= MAX_AGE; i++) {
    $studentAgeSelect.append($('<option>').text(i).val(i));
  }
  
  function updateNumeration(deletedNumber) {
    var $studentCoursesCount = $('input.student-course');
    for (var i = (deletedNumber - 1); i < $studentCoursesCount.length; i++) {
      $($($('div.form-group label:contains("Course ")'))[i]).text('Course ' + 
                                                                 (i + 1) + ':');
    }
  }
  
  function addBorder(elem, value) {
    value ? $(elem).css('border', '2px solid green') : $(elem).css('border', 
                                                               '2px solid red');
  }
  
  function validateName() {
    var studentNamePattern = /^[A-Z][a-z]{2,}$/;
    var result = studentNamePattern.test($studentNameInput.val());
    addBorder($studentNameInput, result);
    return result;
  }
  
  function validateAge() {
    var result;
    isNaN( parseInt($studentAgeSelect.val()) ) ? result = false: 
         (+$studentAgeSelect.val() < 1 || +$studentAgeSelect.val() > 99) ? 
                                           result = false: result = true;
    addBorder($studentAgeSelect, result);
    return result;
  }
  
  function validateCourse(course) {
    var studentCoursePattern = /[A-Za-z\s]{4,}/;
    var result = studentCoursePattern.test($(course).val());
    addBorder(course, result);
    return result;
  }
  
  function validateData() {
    var $studentCoursesCount = $('input.student-course');
    if ($studentCoursesCount.length < 2) {
      alert('Minimum number of courses is two!');
      return false;
    }
    var values = [validateName(),validateAge()];
    for (var i = 0; i < $studentCoursesCount.length; i++) {
      values.push(validateCourse($($studentCoursesCount)[i]));
    }
    if (values.indexOf(false) != -1) {
      alert('Check the entered data!');
      return false;
    } else {
      return true;
    }
  }
  
  function moveData() {
    var movingData = [$studentNameInput.val(), $studentAgeSelect.val()];
    var studentAtUniversityValue = $studentAtUniversityCheckbox.prop("checked") 
                                   === true ? 'Yes' : 'No';
    movingData.push(studentAtUniversityValue);
    var studentCoursesValue = $('input.student-course').map(function() {
      return $(this).val();
    }).get().join(', ');
    if (studentCoursesValue[0] == ',') {
      studentCoursesValue = studentCoursesValue.slice(2);
    }
    movingData.push(studentCoursesValue);
    for (var i = 0; i < movingData.length; i++) {
      $($($dataSpans)[i]).text(movingData[i]);
    }
  }
  
  function addListeners() {
    // adding course
    $addCourse.click(function(event) {
      var $studentCoursesCount = $('input.student-course');
      var $newCourse = $divCourseTemplate.clone(true);
      $newCourse.children('label').text('Course ' + 
                                     ($studentCoursesCount.length + 1) + ':');
      $addCourse.parent().before($newCourse);
      event.preventDefault();
    });
    
    // removing course
    $form.delegate('a.remove-course', 'click', function(event) {
      var $deletedNumber = $(event.target).parent().children('label').text()[7];
      $(event.target).parent().remove();
      updateNumeration($deletedNumber);
    });
    
    // validate data in case focus is lost
    $studentNameInput.blur(function() {
      validateName();
    });
  
    $studentAgeSelect.blur(function() {
      validateAge();
    });
  
    $form.delegate('input.student-course', 'blur', function(event) {
      validateCourse(event.target);
    });
    
    // submit data
    $form.submit(function(event) {
      var valid = validateData();
      if (valid) {
        removeListeners()
        moveData();
        $formDiv.animate({opacity: '0'}, 2000);
        $divData.animate({opacity: '1'}, 2000, function() {
          $divData.animate({left: '-50%'}, 2000, function() {
            $('span.student-name').animate({opacity: '1'}, 1000, function() {
              $('span.student-age').animate({opacity: '1'}, 1000, function() {
                $('span.student-at-university').animate({opacity: '1'}, 1000, function() {
                  $('span.student-courses').animate({opacity: '1'}, 1000, function() {
                    addListeners();
                  });
                });
              });
            });
          });
        });
      }
      event.preventDefault();
    });
    
    // editing data
    $('a.edit-student').click(function() {
      removeListeners();
      $divData.animate({left: '0%'}, 2000, function() {
        $formDiv.animate({opacity: '1'}, 2000);
        $divData.animate({opacity: '0'}, 2000, function() {
          addListeners();
        });
      });
    });
  }
  
  function removeListeners() {
    $form.unbind();
    $('a.edit-student').unbind();
    $studentAgeSelect.unbind();
    $studentNameInput.unbind();
    $addCourse.unbind();
  }
  
});