'use strict';

define(function() {
  return {
    rowView: '\
             <tr> \
               <td>{{first_name}}</td>\
               <td>{{last_name}}</td> \
               <td data-id={{id}}> \
                 <a href="#" class="btn btn-default">Show</a> \
                 <a href="#" class="btn btn-primary">Edit</a>\
                 <a href="#" class="btn btn-danger">Delete</a>\
               </td>\
             </tr>\
             ',
    courseView: '\
                <div class="course-group">\
                  <b>Course{{number}}: </b>\
                  <span class="student-course">{{course}}</span>\
                </div>\
                ',
    selectOption: '\
                  <option value={{id}}>{{id}}</option>\
                  ',
    errorLi: '\
             <li class="list-group-item">{{error}}</li>\
             ',
    addCourse: '\
               <div class="form-group">\
                 <label>Course {{number}}:</label>\
                 <input name="courses[]" class="form-control student-course" value={{course}}>\
                 <a href="#" class="remove-course">Remove course</a>\
               </div>\
               '
  }
});