
$(function () {
var main = $('#main_container');
var currentDay = $('#currentDay');
var time = new Date($.now());

// Date object for formatting
var options = {
  weekday: 'long',    
  month: 'long',     
  day: 'numeric',       
       
};

var formattedDate = time.toLocaleDateString('en-US', options);

currentDay.append(formattedDate);


time = time.getHours();

// Create the internal items of each hour
function timeDivInside(item, timeFormatted){
  var internalDiv = $('<div>').addClass('col-2 col-md-1 hour text-center py-3');
  internalDiv.html(item + timeFormatted);
  var textArea = $('<textarea>');
  textArea.addClass('col-8 col-md-10 description');
  textArea.attr('rows', '3');

  //Get Existing Record
  var savedLine = getStoredLine(`${item}-${timeFormatted}`);
  textArea.html(savedLine != false ? savedLine : '');

  var button = $('<button>').addClass('btn saveBtn col-2 col-md-1');
  button.attr('aria-label', 'save');
  button.on('click', { 'textArea': textArea, 'id': `${item}-${timeFormatted}` }, saveEvent);


  var i = $('<i>').addClass('fas fa-save');
  i.attr('aria-hidden', 'true');
  button.append(i);

  return { internalDiv, textArea, button };
}




// Setup up Calendar
function InitCalendar(){
  [9, 10, 11, 12, 1, 2, 3, 4, 5].forEach((item, index) => {


    var div = $('<div>');
    div.addClass('row time-blow ' + getTimeClass(item, time));
    //is it Am or Pm?
    var timeFormatted = `${item < 13 && item > 8 ? 'am' : 'pm'}`;
    div.attr('id', `${item}-${timeFormatted}`);
    // Get internal contents
    var { internalDiv, textArea, button} = timeDivInside(item, timeFormatted); 
    div.append(internalDiv);
    div.append(textArea);
    
    div.append(button);
    main.append(div);

  });
}
InitCalendar();

function getTimeClass(item, currentTime) {

    // Convert item to a 24-hour format
    if (item < 9) {
      item += 12; // Convert AM hours to PM (e.g., 9 AM becomes 9 + 12 = 21)
    }

  if (item === currentTime) {
      return 'present';
  } else if (item < currentTime) {
      return 'past';
  } else {
      return 'future';
  }
}


function saveEvent({ target, data }){
  var id = data.id;
  var value = data.textArea.val();

 

  var currentStore = localStorage.getItem('schedule') || [];

  if(currentStore != ''){
    currentStore = JSON.parse(currentStore);

    // returns false boolean or relevant index of record if exists
    var index = currentStore.findIndex(function(item) {
      return item.id === id;
    });
   
      if(index != -1){
        currentStore[index].value = value;
      } else {
        var toBeAdded = { 'id': id, 'value': value };
        currentStore.push(toBeAdded);
      }
      localStorage.setItem("schedule", JSON.stringify(currentStore));

  } else {
    var toBeAdded = { 'id': id, 'value': value };
    localStorage.setItem('schedule', JSON.stringify([toBeAdded]));

  }

}



function getStoredLine(id) {
  var currentStore = localStorage.getItem('schedule') || false;

  if(currentStore === false){
    return false;
  } 

  currentStore = JSON.parse(currentStore);

  var index = currentStore.findIndex(function(item) {
    return item.id === id;
  });
 
    if(index != -1){
      return currentStore[index].value;
    } else {
      return false;
    }


  
}



});


