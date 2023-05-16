const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");

const symbols= '~`!@#$%^&*()_-+=";.,/?';

let password="";
let passwordLength = 10;
let checkCount = 0;

setIndicator("#ccc");

handleSlider();
//set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

}

function setIndicator(color){
   indicator.style.backgroundColor = color;

}

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min)) +min;
}
function generateNumber(){
    return getRandomInteger(0,9);
} 
function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,122));
}
function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,90));
}
function generateSymbol(){
    let randomNumber=getRandomInteger(0,symbols.length-1);
    return symbols[randomNumber];
}
function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym-true;

    if(hasUpper && hasLower && (hasNum||hasSym) && passwordLength >=8){
       setIndicator("#0f0");
    }
    else if((hasUpper||hasLower) && (hasNum||hasSym) && passwordLength >=6){
        setIndicator("#f00");
    }
    else{
        setIndicator("#ff0"); 
    }
}


async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
    }
    catch(e){
    }
    //to make copy span visible 
    copyMsg.classList.add("active");
    
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}  

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
       if(checkbox.checked)
          checkCount++;
    });
    console.log(checkCount);
    if(passwordLength>checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
   
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
});

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
}); 
copyBtn.addEventListener('click',()=>{
   if(passwordDisplay.value)
      copyContent();
});

function shufflePassword(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    const temp=array[i];
    array[i]=array[j];
    array[j]= temp;
  }
  let str="";
  array.forEach((el=>(str += el)));
  return str;
}

generateBtn.addEventListener('click',()=>{

    if(passwordLength <= 0) return;

    if(passwordLength < checkCount){
       passwordLength=checkCount;
       handleSlider();
    }   
    password=""; 

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }
     
    let funcArr = [];
    if(uppercaseCheck.checked)
       funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
       funcArr.push(generateLowerCase);   
    if(numbersCheck.checked)
       funcArr.push(generateNumber); 
    if(symbolsCheck.checked){
       funcArr.push(generateSymbol); 
    }   

    //compulsory addition
    for(let i=0;i<funcArr.length;i++){
        
        password += funcArr[i]();
    }  
    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randomIndex = getRandomInteger(0,funcArr.length);
        password += funcArr[randomIndex]();        
    }
    //shuffle the password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value=password; 
    calculateStrength();
});
