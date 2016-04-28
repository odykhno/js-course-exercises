'use strict';

var MIN_TEXT_SIZE = 10,
    MAX_TEXT_SIZE = 20;

window.addEventListener('load', function() {
  
  // getting elements
  var textArea = document.getElementById('text');
  var displayText = document.getElementById('display_text');
  var textSize = document.querySelector('select.text-size');
  var bold = document.querySelector('button.bold');
  var italic = document.querySelector('button.italic');
  var textColor = document.querySelector('button.text-color');
  var palette = document.getElementById('palette');
  palette.style.display = 'none';
  
  // text size filling
  function initTextSize() {
    for (var i = MIN_TEXT_SIZE; i <= MAX_TEXT_SIZE; i++) {
      var textSizeOption = document.createElement('option');
      textSizeOption.innerHTML = i;
      textSizeOption.value = i;
      textSize.appendChild(textSizeOption);
    }
  }
  
  initTextSize();
  
  textArea.addEventListener('input', function() {
    displayText.innerHTML = textArea.value;
  });
  
  //getting current selection
  function getSelection() {
    return textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
  }
  
  // wrapping in tags
  function tagWrapper(selection, tag) {
    return '<' + tag + '>' + selection + '</' + tag + '>';
  }
  
  function finalResult(newPart) {
    return textArea.value.substring(0, textArea.selectionStart) + newPart + 
           textArea.value.substring(textArea.selectionEnd, textArea.value.length);
  }
  
  bold.addEventListener('click', function() {
    displayText.innerHTML = finalResult(tagWrapper(getSelection(), 'b'));
  });
  
  italic.addEventListener('click', function() {
    displayText.innerHTML = finalResult(tagWrapper(getSelection(), 'i'));
  });
  
  textSize.addEventListener('change', function(event) {
    displayText.innerHTML = finalResult(tagWrapper(getSelection(), 'span'));
    var span = displayText.getElementsByTagName('span')[0];
    span.style.fontSize = event.target.value + 'px';
  });
  
  textColor.addEventListener('click', function() {
    if (palette.style.display === 'none') {
      palette.style.display = 'block';
    } else {
      palette.style.display = 'none';
    }
  });
  
  palette.addEventListener('click', function(event) {
    if ( !/^color\-div/.test(event.target.className) ) return;
    displayText.innerHTML = finalResult(tagWrapper(getSelection(), 'span'));
    var span = displayText.getElementsByTagName('span')[0];
    span.style.color = event.target.className.slice(10);
    palette.style.display = 'none';
  });
  
});
