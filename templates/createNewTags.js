var STUDENT_ROW_VIEW = '\
<tr> \
  <td>{{first_name}}</td>\
  <td>{{last_name}}</td> \
  <td data-id={{id}}> \
    <a href="#" class="btn btn-default">Show</a> \
    <a href="#" class="btn btn-primary">Edit</a>\
    <a href="#" class="btn btn-danger">Delete</a>\
  </td>\
</tr>\
';

var STUDENT_COURSE_VIEW = '\
<div class="course-group">\
  <b>Course{{number}}: </b>\
  <span class="student-course">{{course}}</span>\
</div>\
';

var SELECT_OPTION = '\
<option value={{id}}>{{id}}</option>\
';

var ERROR_LI = '\
<li class="list-group-item">{{error}}</li>\
';

var ADD_COURSE = '\
<div class="form-group">\
  <label>Course {{number}}:</label>\
  <input name="courses[]" class="form-control student-course" value={{course}}>\
  <a href="#" class="remove-course">Remove course</a>\
</div>\
';
