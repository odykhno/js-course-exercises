'use strict';

var MIN_AGE = 1;
var MAX_AGE = 99;

window.addEventListener('load', function() {
  
  // getting elements
  var studentAgeSelect = document.querySelector('select.student-age');
  var studentName = document.querySelector('input.student-name');
  var studentAge = document.querySelector('select.student-age');
  var studentAtUniversity = document.querySelector('input.student-at-university');
  var studentCourse = document.getElementsByClassName('student-course');
  var form = document.getElementsByTagName('form')[0];
  var addCourse = document.querySelector('a.add-course');
  var existentCourse = document.querySelectorAll('div.form-group')[3];
  var newCourseTemplate = existentCourse.cloneNode(true);
  
  // form Select filling
  function initAge() {
    for (var i = MIN_AGE; i <= MAX_AGE; i++) {
      var studentAgeOption = document.createElement('option');
      studentAgeOption.innerHTML = i;
      studentAgeOption.value = i;
      studentAgeSelect.appendChild(studentAgeOption);
    }
  }
  
  initAge();
  
  // removing course
  form.addEventListener('click', function(event) {
    if (!event.target.classList.contains('remove-course')) return;
    var deletedNumber = event.target.previousElementSibling.previousElementSibling.innerHTML.toString()[7];
    form.removeChild(event.target.parentNode);
    updateNumeration(deletedNumber);
  });
  
  function updateNumeration(deletedNumber) {
    for (var i = (deletedNumber - 1); i < studentCourse.length; i++) {
      studentCourse[i].previousElementSibling.innerHTML = 'Course ' + (i + 1) + ':';
    }
  }
  
   // adding course
  addCourse.addEventListener('click', function(event) {
    var newCourse = newCourseTemplate.cloneNode(true);
    newCourse.getElementsByTagName('label')[0].innerHTML = 'Course ' + (studentCourse.length + 1) + ':';
    form.insertBefore(newCourse, addCourse.parentNode);
    event.preventDefault();
  });

  function validateName() {
  var studentNamePattern = /^[A-Z][a-z]{2,}$/;
  var result = studentNamePattern.test(studentName.value);
  addBorder(studentName, result);
    return result;
  }
  
  function validateAge() {
    var result;
    isNaN( parseInt(studentAge.value) ) ? result = false: 
    (+studentAge.value < 1 || +studentAge.value > 99) ? result = false: result = true;
    addBorder(studentAge, result);
    return result;
  }
  
  function validateCourse(course) {
    var studentCoursePattern = /[A-Za-z\s]{4,}/;
    var result = studentCoursePattern.test(course.value);
    addBorder(course, result);
    return result;
  }
  
  function validateData() {
    if (studentCourse.length < 2) {
      alert('Minimum number of courses is two!');
      return false;
    }
    var values = [validateName(),validateAge()];
    for (var i = 0; i < studentCourse.length; i++) {
      values.push(validateCourse(studentCourse[i]));
    }
    if (values.indexOf(false) != -1) {
      alert('Check the entered data!');
      return false;
    } else {
      return true;
    }
  }
  
  function addBorder(elem, value) {
    value ? elem.style.border = '2px solid green' : elem.style.border = '2px solid red';
  }
  
  // validate data in case focus is lost
  form.addEventListener('blur', function(event) {
    switch (event.target.className) {
      case 'student-name':
        validateName();
        break;
      case 'student-age':
        validateAge();
        break;
      case 'student-course':
        validateCourse(event.target);
        break;
      default: return;
    }
  }, true);
  
  function moveData() {
    var movingData = [studentName.value, studentAge.value];
    var studentAtUniversityValue = studentAtUniversity.checked == true ? 'Yes' : 'No';
    movingData.push(studentAtUniversityValue);
    var studentCourseList = Array.prototype.map.call(studentCourse, function(elem) {
      return elem.value;
    });
    var studentCoursesValue = Array.prototype.join.call(studentCourseList, ', ');
    if (studentCoursesValue[0] == ',') {
      studentCoursesValue = studentCoursesValue.slice(2);
    }
    movingData.push(studentCoursesValue);
    var spans = document.getElementsByClassName('column')[1].getElementsByTagName('span');
    for (var i = 0; i < movingData.length; i++) {
      spans[i].innerHTML = movingData[i];
    }
  }  

  function formSubmitHandler() {
    form.addEventListener('submit', function(event) {
      var valid;
      valid = validateData();
      if (valid) {
        moveData();
      }
      event.preventDefault();
    });
  }
  
 formSubmitHandler();
});