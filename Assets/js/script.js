
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
  var button = $('<button>').addClass('btn saveBtn col-2 col-md-1');
  button.attr('aria-label', 'save');

  button.on('click', { 'textArea': textArea, 'id': `${item}-${timeFormatted}` }, saveEvent)

  var i = $('<i>').addClass('fas fa-save');
  i.attr('aria-hidden', 'true');
  button.append(i);

  return { internalDiv, textArea, button };
}




// Setup up Calendar
function InitCalendar(){
  [9, 10, 11, 12, 1, 2, 3, 4, 5].forEach((item, index) => {

    console.log("run");
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

  var toBeAdded = { 'id': id, 'value': value };

  var currentStore = localStorage.getItem('schedule') || [];

  if(currentStore != ''){
    console.log("Existed");
    currentStore = JSON.parse(currentStore);
    console.log("content of currentstore", currentStore);
    currentStore.push(toBeAdded);
    localStorage.setItem("schedule", JSON.stringify(currentStore));
  } else {
    console.log("Didnt exist");
    localStorage.setItem('schedule', JSON.stringify([toBeAdded]));
  }
  


}

{/* <div class="row time-blow past" id="9-am">
  <div class="col-2 col-md-1 hour text-center py-3">9am</div>
  <textarea class="col-8 col-md-10 description" rows="3"></textarea>
  <button class="btn saveBtn col-2 col-md-1" aria-label="save"><i class="fas fa-save" aria-hidden="true"></i></button>
</div> */}

  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?

  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?

});


