let myNoteElement = document.getElementById("myNote");               //HTML -לקיחת נתונים מה
let dateElement = document.getElementById("date");
let timeElement = document.getElementById("time");
let errorMessageElement = document.getElementById("errorMessage");
let CreatNoteId = "note-div1";
let notesMap = new Map();



//-------------------------Functions that run permanently in the background-----------------------------------------------------------------------------------//
displaysOldNotes();             // Displays old notes

function displaysOldNotes() {
    let noteDivId = localStorage.getItem("noteDivId");
    if (noteDivId != null) {
        CreatNoteId = JSON.parse(noteDivId);
    }
    let strNotesMap = localStorage.getItem("notesMap");
    if (strNotesMap != null) {
        notesMap = new Map(JSON.parse(strNotesMap));
    }
    for (let [noteDivId, note] of notesMap.entries()) {
        CreatNote(noteDivId, note);
    }
}

limitDateInput();              //Make sure you do not enter dates that have already passed

function limitDateInput() {
    let today = new Date(); 
    let dd = today.getDate();
    let mm = today.getMonth() + 1;       // +1 because January is 01 month
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    dateElement.setAttribute("min", today);
}

//---------------------------------------------------callbeck function---------------------------------------------------------//

function saveNewNote() {                                       //save New Note
    let myNote = myNoteElement.value;
    let date = dateElement.value;
    let time = timeElement.value;
    let note = {
        text: myNote,
        date: date,
        time: time
    }
    try {
        validateNewNote(myNote, date, time);
        CreatNote(CreatNoteId, note);                      //add note to screen
        notesMap.set(CreatNoteId, note);                  //save note in Map
        saveInLocalStorage();                            //save note to local Storage        

        resetNoteBook();                               //Delete details to make it easier to write a new note
    }
    // הקפצת הודעת שגיאה במקרה שחסר נתון
    catch (e) {
        errorMessageElement.style.backgroundColor = "white";
        errorMessageElement.innerHTML = errorMessage;
    }
}

function resetNoteBook() {                    //reset to new notes
    myNoteElement.value = "";                      // reset parameters
    dateElement.value = 0;
    timeElement.value = 0;
    resetErrorMessage()
}

function deleteNote(buttonElement) {                                 //delete one from past notes
    let noteDivElement = buttonElement.parentElement;               //Deletes the parent element (note) and not just the button itself
    let noteDivId = noteDivElement.id;
    notesMap.delete(noteDivId);
    noteDivElement.remove();
    localStorage.setItem("notesMap", JSON.stringify(Array.from(notesMap.entries())));                //Updating Map in local-Storage
}

//-----------------------------------------------Background functions of the buttons------------------------------------------//

function validateNewNote(myTask, date, time) {        //validate for the parameters in new note

    resetErrorMessage()

    myTask = myTask.trim();                         //Delete "white-text" for Avi
    if (myTask == "") {
        myNoteElement.style.border = "2px solid red";
        errorMessage = errorMessage + "Empty text<br>";
    }
    if (time == "") {
        timeElement.style.border = "2px solid red";
        errorMessage = errorMessage + "Empty time<br>";
    }
    if (date == "") {
        dateElement.style.border = "2px solid red";
        errorMessage = errorMessage + "Empty date<br>";
    }

    if (errorMessage != "") {
        throw new Error;
    }
}

function CreatNote(noteDivId, note) {        //Creat note on screen

    let noteDivElement = document.createElement("div");
    noteDivElement.setAttribute("id", noteDivId);
    noteDivElement.setAttribute("class", "note-div p-2");

    let noteImageElement = document.createElement("img");
    noteImageElement.setAttribute("src", "./img/notebg.png");

    let noteTextElement = document.createElement("div");
    noteTextElement.setAttribute("class", "note-text");
    noteTextElement.innerHTML = note.text;

    let noteDateElement = document.createElement("div");
    noteDateElement.setAttribute("class", "note-date");
    noteDateElement.innerHTML = note.date;

    let noteTimeElement = document.createElement("div");
    noteTimeElement.setAttribute("class", "note-time");
    noteTimeElement.innerHTML = note.time;

    let noteEraseButtonElement = document.createElement("button");
    noteEraseButtonElement.setAttribute("class", "note-erase-button");
    noteEraseButtonElement.setAttribute("onclick", "deleteNote(this)");

    let noteButtonTrashSymbolElement = document.createElement("span");
    noteButtonTrashSymbolElement.setAttribute("class", "note-button-trash-symbol");
    noteButtonTrashSymbolElement.setAttribute("aria-hidden", "true");

    noteEraseButtonElement.appendChild(noteButtonTrashSymbolElement);

    noteDivElement.appendChild(noteImageElement);
    noteDivElement.appendChild(noteTextElement);
    noteDivElement.appendChild(noteDateElement);
    noteDivElement.appendChild(noteTimeElement);
    noteDivElement.appendChild(noteEraseButtonElement);

    let notesDivElement = document.getElementById("notes-div");
    notesDivElement.appendChild(noteDivElement);
}

function saveInLocalStorage() {              //Creat uniqli Id and save
    let noteDivStr = "note-div";
    let noteDivLength = noteDivStr.length;

    let OriginalDivNum = CreatNoteId.substring(noteDivLength, CreatNoteId.length);
    let originalDivNum = parseInt(OriginalDivNum);
    let newDivNum = originalDivNum + 1;                           //הוספה של 1 כל פעם
    let strNewDivNum = newDivNum.toString();

    CreatNoteId = CreatNoteId.replace(OriginalDivNum, strNewDivNum);
    localStorage.setItem("noteDivId", JSON.stringify(CreatNoteId));                      // שמירה של המזהה בלוקאל כדי שזה לא ידרוס אותו אחרי רענון
    localStorage.setItem("notesMap", JSON.stringify(Array.from(notesMap.entries())));   //עדכון של המפה בלוקאל
}

function resetErrorMessage() {               //reset Error-Message
    myNoteElement.style.border = "transparent";
    dateElement.style.border = "2px solid gray";
    timeElement.style.border = "2px solid gray";
    errorMessageElement.innerHTML = "";
    errorMessageElement.style.backgroundColor = "transparent";
    errorMessage = ""
}