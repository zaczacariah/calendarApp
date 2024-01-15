
$(function () {

// Var Declarations
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
currentDay.append(formattedDate); // Set Date


time = time.getHours();

// Create the internal items of each hour
//
function timeDivInside(item, timeFormatted){

  var internalDiv = $('<div>').addClass('col-2 col-md-1 hour text-center py-3');
  internalDiv.html(item + timeFormatted);
  var textArea = $('<textarea>');
  textArea.addClass('col-8 col-md-10 description');
  textArea.attr('rows', '3');

  //Get Saved Records
  var savedLine = getStoredLine(`${item}-${timeFormatted}`);
  textArea.html(savedLine != false ? savedLine : '');

  var button = $('<button>').addClass('btn saveBtn col-2 col-md-1');
  button.attr('aria-label', 'save');

  //Button Click Listener
  //Passing textArea and id so I don't need to traverse Dom as much
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

    // Create internal contents
    var { internalDiv, textArea, button } = timeDivInside(item, timeFormatted); 

    // Append Items
    div.append(internalDiv);
    div.append(textArea);
    div.append(button);
    main.append(div);

  });
}
InitCalendar();

// Get Past, Present or Future Class
//
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

// Save Button Event
//
function saveEvent({ data }){
  var id = data.id;
  var value = data.textArea.val();

  var currentStore = localStorage.getItem('schedule') || [];

  //if currentStore not empty
  if(currentStore != ''){
    currentStore = JSON.parse(currentStore);

    // Get index of current item or -1 if doesn't exist
    var index = currentStore.findIndex(function(item) {
      return item.id === id;
    });
    
    // Schedule item exists and will be updated to new value else adds new
    if(index != -1){
      currentStore[index].value = value;
    } else {
      var toBeAdded = { 'id': id, 'value': value };
      currentStore.push(toBeAdded);
    }
    localStorage.setItem("schedule", JSON.stringify(currentStore));

  // If empty
  } else {
    var toBeAdded = { 'id': id, 'value': value };
    localStorage.setItem('schedule', JSON.stringify([toBeAdded]));

  }

}


// Retrieve the stored value for scheduled our or if returns
// false if doesn't exist
function getStoredLine(id) {
  var currentStore = localStorage.getItem('schedule') || false;

  // Break if currentStore doesn't exist
  if(currentStore === false){
    return false;
  } 

  currentStore = JSON.parse(currentStore);

  // Retrieve index or -1
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


