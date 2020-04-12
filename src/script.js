
const desc = 
{

  Backquote: ["til", "~", "`", "ё", "Ё" ],  
  Digit1: ["_1", '1', '!', "1", "!" ],
  Digit2: ["_2",'2','@', "2", "\""],
  Digit3: ["_3",'3','#', "3", "№"],
  Digit4: ["_4",'4',"$", "4", ";"],
  Digit5: ["_5",'5','%', "5", "%"],
  Digit6: ["_6",'6','^', "6", ":"],
  Digit7: ['_7','7','&', "7", "?"],
  Digit8: ['_8','8','*', "8", "*"],
  Digit9: ['_9','9','(', "9", "("],
  Digit0: ['_10','0',')', "0", ")"],

  Minus: ['_-','-','_', "-", "_"],
  Equal: ['equally','=','+', "=", "+"],  

  KeyQ: ['q','q','Q', "й", "Й"],
  KeyW: ['w','w','W', "ц", "Ц"],
  KeyE: ['e','e','E', "у", "У"],
  KeyR: ['r','r','R', "к", "К"],
  KeyT: ['t','t','T', "е", "Е"],
  KeyY: ['y','y','Y', "н", "Н"],
  KeyU: ['u','u','U', "г", "Г"],
  KeyI: ['i','i','I', "ш", "Ш"],
  KeyO: ['o','o','O', "щ", "Щ"],
  KeyP: ['p','p','P', "з", "З"],

  BracketLeft:['ha','[','{', "х", "Х"],
  BracketRight: ['strongSign',']','}', "ъ", "Ъ"],
  Backslash: ['slash','\\','|', "\\", "/"],  

  KeyA: ['a','a','A', "ф", "Ф"],
  KeyS: ['s','s','S', "ы", "Ы"],
  KeyD: ['d','d','D', "в", "В"],
  KeyF: ['f','f','F', "а", "А"],
  KeyG: ['g','g','G', "п", "П"],
  KeyH: ['h','h','H', "р", "Р"],
  KeyJ: ['j','j','J', "о", "О"],
  KeyK: ['k','k','K', "л", "Л"],
  KeyL: ['l','l','L', "д", "Д"],

  Semicolon: ['colon',';',':', "ж", "Ж"],
  Quote: ['quotation_marks',"'",'"', "э", "Э"], 
  KeyZ: ['z','z','Z', "я", "Я"],
  KeyX: ['x','x','X', "ч", "Ч"],
  KeyC: ['c','c','C', "с", "С"],
  KeyV: ['v','v','V', "м", "М"],
  KeyB: ['b','b','B', "и", "И"],
  KeyN: ['n','n','N', "т", "Т"],
  KeyM: ['m','m','M', "ь", "Ь"],

  Comma: ['comma',',','<', "б", "Б"],
  Period: ['point','.','>', "ю", "Ю"],
  Slash: ['question','/','?', ".", ","],
  Space: ['space',' ',' ',' ',' '],
  Enter: ['enter','\n','\n','\n','\n'],

  ArrowLeft: ['arrow2','◄','◄', "◄", "◄"],
  ArrowRight: ['arrow3','►','►', "►", "►"],
  ArrowDown: ['arrow4','▼','▼', "▼", "▼"],
  ArrowUp: ['arrow1','▲','▲', "▲", "▲"],
  
  Backspace: ['backspace'],
  Tab: ['tab'],
  Delete: ['del'],
  CapsLock: ['caps'],
  ShiftLeft: ['shift'],  
  ShiftRight: ['Shift_'],
  ControlRight: ['Ctrl_'],
  ControlLeft: ['ctrl'],
  MetaLeft: ['win'],
  AltLeft: ['alt'],
  AltRight: ['Alt_'],   
};

constructText();
constructVirtKeyboard();

let pressKey = '';

if (localStorage.lang === undefined){
 localStorage.lang = 'eng';
}
let changeLangUpKeyFlag = false;
let CapsLock = false;
let ShiftCase = false;
let ShiftCaseLeft = false;
let AltCaseLeft = false;

const text = document.querySelector('.text');
const virt_keyboard = document.querySelector('.virt_keyboard');


class Key {
  constructor ({code, key, style}) {
    this.code = code; 
    this.className = `button ${style}`; 
    this.key = key;
  }

  generateKey() {
    const div = document.createElement('div');
    div.className = this.className; 
    div.dataset.code = this.code;
    div.dataset.key = this.key;
    div.innerHTML = this.code;
    return div;
  }
}

createKeyContainers();
drawKey();
text.focus();



virt_keyboard.addEventListener('mousedown', function(event) {
  text.focus();
  if (event.target.classList[0] === "virt_keyboard") {
    return;
  }
  pressKey = event.target;
  setStyle(event.target, true);
  identifyKey(event.target.dataset, "down");
  drawKey();
  
});

virt_keyboard.addEventListener('mouseup', function(event) {
  text.focus();
  removeLastHandlerKeyStyle();
  identifyKey(event.target.dataset, "up");
  drawKey();
});

document.addEventListener('keydown', function(event) {
  if (event.repeat){ 
    return;
  }
  event.preventDefault(); 
  setStyle (document.querySelector(`.${desc[event.code][0]}`), true);  
  identifyKey(event, 'down');
  checkLang();
  drawKey();
});

document.addEventListener('keyup', function(event) { 

  if (event.key === "CapsLock"||event.repeat) {
    return;
  }
  setStyle (document.querySelector(`.${desc[event.code][0]}`), false);
  identifyKey(event, 'up');
  checkLang();
  drawKey();
 });

function setStyle (code, enabled) {
  if (enabled){
     code.classList.add("active");
  }
  else {
    code.classList.remove("active");
  }
}

function removeLastHandlerKeyStyle () {
  pressKey.classList.remove("active");
}

function capsKeyIsHandler() {
  CapsLock = !CapsLock;
  ShiftCase = !ShiftCase;
}

function deleteKeyHandler() {
  let arr = text.value.split('');
  let pos = text.selectionStart;
  arr.splice(pos, 1);
  text.value = arr.join('');
  text.selectionStart = text.selectionEnd = pos;
}

function backspaceKeyIsHandler() {
  let arr = text.value.split('');
  let pos = text.selectionStart;
  if (pos === 0) {
    return;
  }
  arr.splice(pos - 1, 1);
  text.value = arr.join('');
  text.selectionStart = text.selectionEnd = pos -1;
}

function addLetterToTextarea(key) {
  let arr = text.value.split('');
  let pos = text.selectionStart;
  arr.splice(pos, 0, key);
  text.value = arr.join('');
  text.selectionStart = text.selectionEnd = pos + 1;
}


function identifyKey(event, updown) {
  if (event.code === "ShiftLeft") {
    ShiftCaseLeft = !ShiftCaseLeft
  }  
  if (event.code === "AltLeft") {
    AltCaseLeft = !AltCaseLeft;
  } 

  if (event.code === "CapsLock") {
    if (event.target.dataset.code === "CapsLock") {
      return;
    }
    if (CapsLock === true) {
      setStyle (document.querySelector(`.${desc[event.code][0]}`), false);  
    }
    capsKeyIsHandler();
  } 
  
  if (event.key === "Shift" || event.key === "Shift_" || event.key === "shift") {
    capsKeyIsHandler();
    return;
  } 

  if (updown === "down"){

    if (event.code === "Tab") {
      tabCase();
    } 

    if (event.code === "Backspace") {
      backspaceKeyIsHandler();
    } 
  
    if (event.code === "Delete") {
      deleteKeyHandler();
    } 

    if ( localStorage.lang === 'eng' && ShiftCase === false) {   
        if (desc[event.code][1] !== undefined) {
          addLetterToTextarea(desc[event.code][1]);
        }      
    }

    if ( localStorage.lang === 'eng' && ShiftCase === true ) {
        if (desc[event.code][2] !== undefined) {
          addLetterToTextarea(desc[event.code][2]);
        }      
    }

    if (localStorage.lang === 'rus' && ShiftCase === false ) {
        if (desc[event.code][3] !== undefined) {
          addLetterToTextarea(desc[event.code][3]);
        }      
    }

    if ( localStorage.lang === 'rus' && ShiftCase === true) {
        if (desc[event.code][4] !== undefined) {
          addLetterToTextarea(desc[event.code][4]);
        }      
    }
  }  
}

function tabCase() {
  let arr = text.value.split('');
  let pos = text.selectionStart;
  arr.splice(pos, 0, "    ");
  text.value = arr.join('');
  text.selectionStart = text.selectionEnd = pos + 4;
}

function checkLang() {
  if (changeLangUpKeyFlag) {
    if (ShiftCaseLeft === false && AltCaseLeft === false) {
      changeLangUpKeyFlag = false;
      changeLang();
      drawKey();
    }  
  } 
  else {
  if (ShiftCaseLeft === true && AltCaseLeft === true) {
    changeLangUpKeyFlag = true;
  }  
  else {
    return; 
  }
}    
}

function changeLang () {

  if (localStorage.lang === 'eng') {
    localStorage.lang = 'rus';
  } 
  else {
    localStorage.lang = 'eng';
  } 
}

function drawKey() {
  let arrVals = Object.values(desc);

  if ( localStorage.lang === 'eng' && ShiftCase === false) {
    arrVals.forEach(el => {
      let x = document.querySelector(`.${el[0]}`);
      if (el.length < 2) {
        x.innerText = el[0];
      } 
      else{
         if (el[0] === 'enter') {
      } 
      else {
        if (el[1] !== undefined) { 
        x.innerText = el[1];
      }     
    }
  } 
    });
  }

  if (localStorage.lang === 'eng' && ShiftCase === true) {
    arrVals.forEach(el => {
      let x = document.querySelector(`.${el[0]}`);
      if (el.length < 2) {
        x.innerText = el[0];
      } 
      else {
         if (el[0] === 'enter') {
      } 
      else{
         if (el[2] !== undefined) {
        x.innerText = el[2];
      } 
    }
  }     
    });
  }

  if (localStorage.lang === 'rus' && ShiftCase === false) {
    arrVals.forEach(el => {
      let x = document.querySelector(`.${el[0]}`);
      if (el.length < 2) {
        x.innerText = el[0];
      } 
      else {
        if (el[0] === 'enter') {
      } 
      else {
        if (el[3] !== undefined) {
        x.innerText = el[3];
      } 
    }
  }
    });
  }

  if ( localStorage.lang === 'rus' && ShiftCase === true) {
    arrVals.forEach(el => {
      let x = document.querySelector(`.${el[0]}`);
      if (el.length < 2) {
        x.innerText = el[0];
      }
       else {
         if (el[0] === 'enter') {
      } 
      else {

       if (el[4] !== undefined) {
        x.innerText = el[4];
       }
      }
      }      
    });
  }
}



function constructVirtKeyboard() {
  let div = document.createElement('div');
  div.className = "virt_keyboard"; 
  document.body.append(div);
}


const writeParagr = () => {
  const p = `<p>Клавиатура была создана на Windows. <br> Переключение языка: shift + alt</p>`;
  document.body.insertAdjacentHTML("afterbegin", p);
}
function constructText() {

  let textarea = document.createElement('textarea');
  textarea.className = "text";
  document.body.append(textarea);
}

function createKeyContainers() {
  let mas = [];
  let arr = Object.keys(desc);
  arr.forEach(el => {
     mas.push(new Key({
      code: el,
      key: desc[el][0],
      style: desc[el][0],
    })); 
  });
   mas.forEach(el => {
    virt_keyboard.append(el.generateKey());
  }) ; 
}
writeParagr();





