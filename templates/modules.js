var student = (function() {
  var URL = 'https://spalah-js-students.herokuapp.com/students';
  
  function getAll(callback) {
  	$.get({
      url: URL,
      contentType: "application/json",
      dataType: 'json',
      success: function(data) {
      	callback(data);
      }      
    });
  }

  function getStudentById(elem, errorCallback, callback) {
    var selectedStudent = $(elem).parent().attr('data-id');
    $.get({
      url: URL + '/'+ selectedStudent,
      contentType: 'application/json',
      datatype: 'json',
      error: errorCallback,
      success: callback
    });
  }

  function remove(elem, errorCallback, callback) {
  	var selectedStudent = $(elem).parent().attr('data-id');
    $.ajax({
      url: URL + '/' + selectedStudent,
      type: 'DELETE',
      error: errorCallback, 
      success: function(data) {
      	callback(data);
      }
    });
  }

  function submitRequest(url, type, dataObject, errorCallback, callback) {
    $.ajax({
      url: url,
      type: type,
      data: dataObject,
      success: function(data) {
        if (data.errors) {
          errorCallback(data);    
        } else {
          callback(data);
        }
      }
    }); 
  }

  function post(dataObject, errorCallback, callback) {
  	submitRequest(URL, 'POST', dataObject, errorCallback, callback);
  }

  function put(selectedStudent, dataObject, errorCallback, callback) {
  	submitRequest(URL + '/' + selectedStudent, 'PUT', dataObject, errorCallback,
  	             callback);
  }

  return {
  	getAll: getAll,
  	getStudentById: getStudentById,
  	remove: remove,
  	post: post,
  	put: put
  }
})();