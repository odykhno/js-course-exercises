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
  var spans = document.getElementsByClassName('column')[1].getElementsByTagName('span');
  var addCourse = document.querySelector('a.add-course');
  var edit = document.querySelector('a.edit-student');
  var formDiv = document.getElementsByClassName('column')[0];
  var dataDiv = document.getElementsByClassName('right-column')[0];
  var existentCourse = document.querySelectorAll('div.form-group')[3];
  var newCourseTemplate = existentCourse.cloneNode(true);
  
  formDiv.style.opacity = 1;
  dataDiv.style.opacity = 0;
  dataDiv.style.position = 'relative';
  
  initAge();
  addListeners();
  
  // form Select filling
  function initAge() {
    for (var i = MIN_AGE; i <= MAX_AGE; i++) {
      var studentAgeOption = document.createElement('option');
      studentAgeOption.innerHTML = i;
      studentAgeOption.value = i;
      studentAgeSelect.appendChild(studentAgeOption);
    }
  }
  
  function updateNumeration(deletedNumber) {
    for (var i = (deletedNumber - 1); i < studentCourse.length; i++) {
      studentCourse[i].previousElementSibling.innerHTML = 'Course ' + (i + 1) + ':';
    }
  }
  
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
    elem.style.border = value ? '2px solid green' : '2px solid red';
  }
  
  function moveData() {
    var movingData = [studentName.value, studentAge.value];
    var studentAtUniversityValue = studentAtUniversity.checked === true ? 'Yes' : 'No';
    movingData.push(studentAtUniversityValue);
    var studentCourseList = Array.prototype.map.call(studentCourse, function(elem) {
      return elem.value;
    });
    var studentCoursesValue = Array.prototype.join.call(studentCourseList, ', ');
    if (studentCoursesValue[0] == ',') {
      studentCoursesValue = studentCoursesValue.slice(2);
    }
    movingData.push(studentCoursesValue);
    for (var i = 0; i < movingData.length; i++) {
      spans[i].innerHTML = movingData[i];
      spans[i].style.opacity = 0;
    }
  }  
  
  // for opacity animation
  function ChangeOpacity(duration, elem, action) {
    this.duration = duration;
    this.timing = function(timeFraction) {
      var result = action == 'fade' ? 1 - timeFraction : timeFraction;
      return result;
    };
    this.draw = function(progress) {
      elem.style.opacity = progress;
    };
  }
  
  // for position animation
  function ChangePosition(duration, elem, side) {
    this.duration = duration;
    this.timing = function(timeFraction) {
      var result = side == 'left' ? timeFraction : timeFraction - 1;
      return result;
    };
    this.draw = function(progress) {
      elem.style.left = side == 'left' ? (1 - progress * 50) + '%' : progress * 50 + '%';
    };
  }
 
  function dataAppearance() {
    for (var i = 0; i < spans.length; i++)(function(i) {
      setTimeout(function() {
        spans[i].style.opacity = 1;
      }, (i + 1) * 500);
    })(i);
  }

  function animate(options) {
    var start = performance.now();
    requestAnimationFrame(function animate(time) {
      var timeFraction = (time - start) / options.duration;
      if (timeFraction > 1) timeFraction = 1;
      var progress = options.timing(timeFraction);
      options.draw(progress);
      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });
  }
  
  // removing course
  function removeCourseHandler(event) {
    if (!event.target.classList.contains('remove-course')) return;
    var deletedNumber = event.target.previousElementSibling.previousElementSibling.innerHTML.toString()[7];
    form.removeChild(event.target.parentNode);
    updateNumeration(deletedNumber);
  }
  
  // adding course
  function addCourseHandler(event) {
    var newCourse = newCourseTemplate.cloneNode(true);
    newCourse.getElementsByTagName('label')[0].innerHTML = 'Course ' + (studentCourse.length + 1) + ':';
    form.insertBefore(newCourse, addCourse.parentNode);
    event.preventDefault();
  }
  
  // validate data in case focus is lost
  function formBlurHandler(event) {
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
  }
  
  // submit data
  function submitHandler(event) {
    var valid = validateData();
    if (valid) {
      removeListeners();
      moveData();
      animate(new ChangeOpacity(2000, formDiv, 'fade'));
      animate(new ChangeOpacity(2000, dataDiv, 'appear'));
      setTimeout(animate, 2000, new ChangePosition(2000, dataDiv, 'left'));
      setTimeout(dataAppearance, 4000);
      setTimeout(addListeners, 6000);
    }
    event.preventDefault();
  }
  
  // editing data
  function editHandler() {
    removeListeners();
    animate(new ChangePosition(2000, dataDiv, 'right'));
    setTimeout(animate, 2000, new ChangeOpacity(2000, dataDiv, 'fade'));
    setTimeout(animate, 2000, new ChangeOpacity(2000, formDiv, 'appear'));
    setTimeout(addListeners, 4000);
  }
  
  function addListeners() {
    form.addEventListener('click', removeCourseHandler);
    addCourse.addEventListener('click', addCourseHandler);
    form.addEventListener('blur', formBlurHandler, true);
    form.addEventListener('submit', submitHandler);
    edit.addEventListener('click', editHandler);
  }
  
  function removeListeners() {
    form.removeEventListener('click', removeCourseHandler);
    addCourse.removeEventListener('click', addCourseHandler);
    form.removeEventListener('blur', formBlurHandler, true);
    form.removeEventListener('submit', submitHandler);
    edit.removeEventListener('click', editHandler);
  }
 
});