// global variables
let isStartedTyping = false;
let timerTimeoutId;
const duration = parseInt(localStorage.time) * 60;
const username = localStorage.currentUser;
const paragraphId = parseInt(localStorage.paragraphId);
const typingType = parseInt(localStorage.typingType);
let paragraph = [""];
// let currentTimeLeft = duration * 1000; // if time is in milliseconds
let currentTimeLeft = duration;
let currentCharacterNo = 0;
let currentWordNo = 0;
let timerStartingTime = 0;
let timerEndingTime = 0;
const keyPressData = {
    backspacePress: 0,
    deletePress: 0,
    get totalKeyPress() {
        return this.backspacePress + this.deletePress;
    }
}

// elements constants
const paragraphToType = document.getElementById("paragraphToType");
const typingField = document.getElementById("typingField");
const timer = document.getElementById("timer");
const backspaceOption = document.getElementById("backspaceOption");
// const word_highlighting_option = document.getElementById("word_highlighting_option");
// const typingFieldOption = document.getElementById("typingFieldOption");
const highlightType = document.getElementById("highlightType");
// const highlightOption = document.querySelector("input[name=highlightOption]");
const highlightOption = document.optionsForm.highlightOption;
highlightType.addEventListener("change", (e) => {
    if (e.target.type === "radio" && e.target.name === "highlightOption") {
        // if user choose character highlighting
        paragraphToType.innerHTML = "";
        if (e.target.value === "character") {
            test_english.forEach(({ id, title, body }) => {
                if (id === paragraphId) paragraph = body.split("");
            })
            paragraph.forEach((e) => {
                const spanTag = `<span>${e}</span>`;
                paragraphToType.innerHTML += spanTag;
            })
        }
        else {
            test_english.forEach(({ id, title, body }) => {
                if (id === paragraphId) paragraph = body.split(" ");
            })
            paragraph.forEach((e) => {
                const spanTag = `<span>${e} </span>`;
                paragraphToType.innerHTML += spanTag;
            })
        }
        
    }
})
const countdownFrame = document.getElementById("countdownFrame");
countdownFrame.onload = (e) => {
    const userNameInWelcome = countdownFrame.contentDocument.getElementById("userNameInWelcome");
    userNameInWelcome.innerText = username;
    setTimeout((element) => {
        element.style.opacity = "0";
        element.style.zIndex = "-10";
        element.style.display = "none";
    }, 1800, e.target)
}
const countdownFrameDocument = countdownFrame.contentDocument;
setTimeout(() => {
    countdownFrame.hidden = true;
}, 2000)


const fullScreenBtn = getFullScreenBtn();
document.body.appendChild(fullScreenBtn);

const $ = (id) => document.getElementById(id); // Define a function to get elements by ID
const result = {
    time: $("resultTime"),
    rightWordCount: $("resultRightWordCount"),
    wrongWordCount: $("resultWrongWordCount"),
    skipWordCount: $("resultSkipWordCount"),
    doubleWordCount: $("resultDoubleWordCount"),
    totalKeyPressCount: $("resultTotalKeyPressCount"),
    backSpacePressCount: $("resultBackSpacePressCount"),
    deleteKeyPressCount: $("resultDeleteKeyPressCount"),
    totalWordErrorCount: $("resultTotalWordErrorCount"),
    extraWordCount: $("resultExtraWordCount"),
};

const submitBtn = document.getElementById("submitBtn");
submitBtn.onclick = showResult;
const resultWindow = document.getElementById("resultWindow");
const typingWindow = document.getElementById("typingWindow");
const userNameInResult = document.getElementById("userNameInResult");

// Work flows starts from here    
// typingField.autofocus()
test_english.forEach(({ id, title, body }) => {
    if (id === parseInt(localStorage.paragraphId)) paragraph = body.split("");
})
paragraph.forEach((e) => {
    const spanTag = `<span>${e}</span>`;
    paragraphToType.innerHTML += spanTag;
})
const characterSpanTag = document.querySelectorAll("#paragraphToType span");
timer.innerText = getFormattedTime(currentTimeLeft); // set the intial value for timer
// positioning the cursor
// characterSpanTag[currentCharacterNo].classList.add("")

backspaceOption.addEventListener("change", (e) => {
    isBackspaceAllowed = e.target.checked;
})

typingField.addEventListener("input", (e) => {
    if (!isStartedTyping) {
        startTimer();
        isStartedTyping = true;
    }
    const characterSpanTag = document.querySelectorAll("#paragraphToType span");

    if (highlightOption.value === 'character') {
        // oldTypingFieldData = typingField.value; // saving current state for future use
        // const characterSpanTag = document.querySelectorAll("#paragraphToType span");
        const characterInTypingField = typingField.value.split("");

        // characterSpanTag[currentCharacterNo].focus();

        if (e.data !== null && typingField.value.length <= characterSpanTag.length) {
            // Placing the cursor on the next Character
            characterSpanTag[currentCharacterNo].classList = []; // clearing the classList before changing the clasList
            if (currentCharacterNo + 1 < characterSpanTag.length) (characterSpanTag[currentCharacterNo + 1]).classList.add("text-blue-500", "bg-blue-200", "border-b-2", "border-blue-700");

            // if user input the correct character
            if (characterInTypingField[currentCharacterNo] === characterSpanTag[currentCharacterNo].innerText) {
                characterSpanTag[currentCharacterNo].classList.add("text-green-500");
                (typingField.value.length < characterSpanTag.length) ? currentCharacterNo++ : showResult();
            } else {
                // if user input wrong input character
                characterSpanTag[currentCharacterNo].classList.add("text-red-500", "bg-red-200");
                (typingField.value.length < characterSpanTag.length) ? currentCharacterNo++ : showResult();
            }

            // if user input between the previously typed paragraph in typingField
            if (e.data !== characterInTypingField[currentCharacterNo - 1]) {   // (currentCharacterNo - 1) because already increased the value above
                // checking for every character from selection end
                checkEveryCharacter(characterInTypingField, characterSpanTag, e.target.selectionStart - (currentCharacterNo - e.target.selectionStart))
            }
        }

        // if user uses backspace or delete to delete the character
        if (e.data === null) {
            const oldCharacterNo = currentCharacterNo;
            currentCharacterNo = typingField.value.length;  // user can use ctrl to delete a word

            (characterSpanTag[oldCharacterNo]).classList = []; // clearing the classList before performing any operation

            // if backspace or delete used in between
            let characterDeleted = oldCharacterNo - currentCharacterNo;
            for (let i = 1; i <= characterDeleted; i++) {
                characterSpanTag[characterDeleted + currentCharacterNo - i].classList = [];
            }

            // adding cursor after clearing the classes 
            (characterSpanTag[currentCharacterNo]).classList.add("text-blue-500", "bg-blue-200", "border-b-2", "border-blue-700");

            // if user used backspace or delete in between
            if (e.target.selectionStart !== currentCharacterNo) checkEveryCharacter(characterInTypingField, characterSpanTag, e.target.selectionEnd - characterDeleted)
        }
    } else {
        const wordInTypingField = typingField.value.split(" ");

        if(e.data !== null && wordInTypingField.length <= paragraph.length) {
            // Placing the cursor on the first word
            characterSpanTag[currentWordNo].classList = []; // clearing the classList before changing the clasList
            if (currentWordNo < paragraph.length) (characterSpanTag[currentWordNo]).classList.add("text-blue-500", "bg-blue-200", "border-b-2", "border-blue-700");
        }
            
        if (e.data !== null && e.data.at(-1) === " " && wordInTypingField.length <= paragraph.length + 1) {
            // Placing the cursor on the next word
            characterSpanTag[currentWordNo].classList = []; // clearing the classList before changing the clasList
            if (currentWordNo + 1 < paragraph.length) (characterSpanTag[currentWordNo + 1]).classList.add("text-blue-500", "bg-blue-200", "border-b-2", "border-blue-700");

            // if user input the correct word
            if (wordInTypingField[currentWordNo] === paragraph[currentWordNo]) {
                characterSpanTag[currentWordNo].classList.add("text-green-500");
                (wordInTypingField.length < paragraph.length+1) ? currentWordNo++ : showResult(); 
            } else {
                // if user input wrong input character
                characterSpanTag[currentWordNo].classList.add("text-red-500", "bg-red-200");
                (wordInTypingField.length < paragraph.length +1) ? currentWordNo++ : showResult();
            }

            // if user input between the previously typed paragraph in typingField
            if (e.data !== wordInTypingField[currentWordNo - 1]) {   // (currentWordNo - 1) because already increased the value above
                // checking for every character from selection end
                checkEveryCharacter(wordInTypingField, paragraph, e.target.selectionStart - (currentWordNo - e.target.selectionStart))
            }
        }
        
        // if user uses backspace or delete to delete the character
        if (e.data === null && wordInTypingField.length - 1 < currentWordNo) {
            const oldCharacterNo = currentWordNo;
            currentWordNo = wordInTypingField.length - 1;  // user can use ctrl to delete a word

            (characterSpanTag[oldCharacterNo]).classList = []; // clearing the classList before performing any operation

            // if backspace or delete used in between
            let wordDeleted = oldCharacterNo - currentWordNo;
            for (let i = 1; i <= wordDeleted; i++) {
                characterSpanTag[wordDeleted + currentWordNo - i].classList = [];
            }

            // adding cursor after clearing the classes 
            (characterSpanTag[currentWordNo]).classList.add("text-blue-500", "bg-blue-200", "border-b-2", "border-blue-700");

            // if user used backspace or delete in between
            if (e.target.selectionStart !== currentWordNo) checkEveryCharacter(wordInTypingField, characterSpanTag, e.target.selectionEnd - wordDeleted)
        }
    }
})

typingField.addEventListener('keydown', function (event) {
    let keyCode = event.keyCode || event.which;

    // Check if the Backspace key is pressed and the checkbox is checked
    if (keyCode === 8 && !backspaceOption.checked) {
        event.preventDefault(); // Prevent Backspace key
    }
});

// Disable cut
typingField.addEventListener('cut', function (event) {
    event.preventDefault(); // Prevent copying
});
// Disable copying
typingField.addEventListener('copy', function (event) {
    event.preventDefault(); // Prevent copying
});
// Disable pasting
typingField.addEventListener('paste', function (event) {
    event.preventDefault(); // Prevent pasting
});

// functions are defined below 🤩🤩🤩🤩
function startTimer() {
    // setting interval for Timer
    console.log("Working");
    timerTimeoutId = setInterval(initTimer, 1000);
    timerStartingTime = new Date().getTime();
    return;
}

function initTimer() {
    currentTimeLeft--;
    timer.innerText = getFormattedTime(currentTimeLeft);
    if (currentTimeLeft === 0){
        clearInterval(timerTimeoutId);
        showResult();
    } 
}

function resetTimer() {
    clearInterval(timerTimeoutId);
    currentTimeLeft = duration;
}

function getFormattedTime(duration = '') {
    let minutes = Math.floor(duration / 60);
    minutes = Math.floor(minutes).toString();
    let seconds = (duration - (minutes * 60));
    seconds = Math.floor(seconds).toString();
    minutes = minutes.length === 1 ? `0${minutes}` : minutes;
    seconds = seconds.length === 1 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
}

function checkEveryCharacter(characterInTypingField, characterSpanTag, checkFromWhichPlace = 0) {
    const newCharacterInTypingField = (checkFromWhichPlace) ? characterInTypingField.slice(checkFromWhichPlace, currentCharacterNo) : characterInTypingField;
    newCharacterInTypingField.forEach((character, index) => {
        characterSpanTag[checkFromWhichPlace + index].classList = [];
        if (character === characterSpanTag[checkFromWhichPlace + index].innerText) {
            characterSpanTag[checkFromWhichPlace + index].classList.add("text-green-500");
        } else {
            characterSpanTag[checkFromWhichPlace + index].classList.add("text-red-500", "bg-red-200");
        }
    })
}

function showResult() {
    timerEndingTime = new Date().getTime();
    clearInterval(timerTimeoutId);
    userNameInResult.innerText = username;
    typingWindow.classList.remove("opacity-1", "z-1");
    typingWindow.classList.add("hidden", "opacity-0", "z-0");
    resultWindow.classList.remove("hidden", "opacity-0", "z-0");
    resultWindow.classList.add("opacity-1", "z-1");
    result.time.innerText = (timerStartingTime && timerEndingTime) ? getFormattedTime(( timerEndingTime - timerStartingTime)/1000) : "00:00";

    // Preparing Result
    // const
}