// @author: Violet(Yafan) Zeng 


const inputQuestion = document.getElementById("input-textbox");
const submitButton = document.getElementById("submit-button");
const responseShield = document.getElementById("response-shield");
const responsePage = document.getElementById("response-page");
const feedbackDiv = document.getElementById("feedback-div");
const feedbackHeaderImg = document.getElementById("feedback-header-img");
const feedbackClose = document.getElementById("feedback-close-img");
const feedbackOptions = document.getElementById("feedback-options");
const feedbackSubmit = document.getElementById("feedback-submit");
const feedbackInput = document.getElementById("feedback-input");
const feedbackCheckR = document.getElementById("feedback-option-R");
const feedbackCheckO = document.getElementById("feedback-option-O");
const feedbackCheckH = document.getElementById("feedback-option-H");


inputQuestion.addEventListener("input", () => {
    if (inputQuestion.value.trim().length >=1) {
        submitButton.classList.add("active");
    } else {
        submitButton.classList.remove("active");
    }
})

// question = 'hello'
// answer = `Requires approval from Price and Product team<br>Purpose:\u00a0How to check and edit store groups in CFC.\u00a0 Used to activate or deactivate price and product changes at specific stores.\nSteps:\nLog into CFC.\nSelect Maintenance > Business > Hierarchies\nVerify correct owner from drop down.\nSelect the appropriate group you wish to verify from the Hierarchy window by clicking on the + button.\nClick on the + button to the left of activate.\nVerify stores within the group drop down.\nIf you are not able to locate a store that should be part of your selected group, click on activate.\nSelect the store you wish to add from the stores window and then click on the << button to add store to group.\nVerify store was added to group within the Hierarchy window.`
// showAnswer(question,answer);

submitButton.addEventListener("click", async () => {

    responseShield.style.display="none";

    submitButton.classList.remove("active");;

    // console.log("submit clicked");
    let question = inputQuestion.value;
    showQuestion(question);

    if (!question) {
        alert('Please enter a valid question.');
        return;
    }

    try {
        const res = await fetch('/getAnswer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
        });

        const data = await res.json();
        let response = data.answer;

        // console.log(response.Raw_data);

        showAnswer(response);

        inputQuestion.value = "";


    } catch (error) {
        console.log('An error occurred while fetching the answer.');
    }

});




function showQuestion(question) {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question-div");

    const questionImgDiv =  document.createElement("div");
    questionImgDiv.classList.add("response-img-div");

    const questionImg = document.createElement("img");
    questionImg.src = "pics/User avatar.png";
    questionImgDiv.appendChild(questionImg);

    const questionText =  document.createElement("div");
    questionText.classList.add("response-text-div");
    questionText.innerHTML = question;

    questionDiv.appendChild(questionImgDiv);
    questionDiv.appendChild(questionText);

    responsePage.appendChild(questionDiv);

    const answerDiv = document.createElement("div");
    answerDiv.classList.add("answer-div");

    const answerImgDiv =  document.createElement("div");
    answerImgDiv.classList.add("response-img-div");

    const answerImg = document.createElement("img");
    answerImg.src = "pics/AI bot.png";
    answerImgDiv.appendChild(answerImg);

    const answerText =  document.createElement("div");
    answerText.classList.add("response-text-div");
    answerText.innerHTML = " ";

    answerDiv.appendChild(answerImgDiv);
    answerDiv.appendChild(answerText);

    responsePage.appendChild(answerDiv);

    let i = 0;

    setInterval(function() {
        if(answerText.innerHTML.startsWith(" ")){
            answerText.innerHTML = answerText.innerHTML +'.';
            i++;
            if(i == 4) {
                answerText.innerHTML = " ";
                i = 0;
            };
        };
    }, 500);


}

function showAnswer(response) {

    let question = response.Question;
    let answer = response.Raw_data.replace(/\n/g, "<br>").trim();
    let score = (response.Score*100).toFixed(2);

    const answerDivs = document.getElementsByClassName("answer-div");
    const answerDiv = answerDivs[answerDivs.length - 1];

    const answerTexts = document.getElementsByClassName("response-text-div");
    const answerText = answerTexts[answerTexts.length - 1];
    answerText.innerHTML = answer;

    // console.log("answerDivs",answerDivs)


    const answerFB = document.createElement("div");
    answerFB.classList.add("response-fb-div");

    const thumbUp = document.createElement("img");
    thumbUp.classList.add("response-fb-div");
    thumbUp.src = "pics/Like.png";
    answerFB.appendChild(thumbUp);

    const thumbDown = document.createElement("img");
    thumbDown.classList.add("response-fb-div");
    thumbDown.src = "pics/Dislike.png";
    answerFB.appendChild(thumbDown);

    answerDiv.appendChild(answerFB);

    const scoreDiv = document.createElement("div");
    scoreDiv.classList.add("response-score-div");
    scoreDiv.innerHTML = "Score: "+ score;
    answerDiv.appendChild(scoreDiv);  


    const answerHeight = window.getComputedStyle(answerText).height;
    answerDiv.style.height =  parseInt(answerHeight, 10) + 40 + 'px';

    console.log("answerHeight",answerHeight);
    console.log("answerDiv",answerDiv.style.height);

    thumbDown.addEventListener("click", () => {
        feedbackDiv.style.display="flex";
        feedbackHeaderImg.src = "pics/Dislike feedback.png";
        feedbackOptions.style.display="flex";
        feedbackInput.value = "";

        feedbackClose.addEventListener("click", () => {
            feedbackDiv.style.display="none";
        });

        feedbackSubmit.addEventListener("click",() => {

            const fbArray = ["repetitive", "outdated", "harmful"];
            const boolArray = [feedbackCheckR.checked, feedbackCheckO.checked, feedbackCheckH.checked];
            const fbCheckArray = fbArray.filter((_, index) => Boolean(boolArray[index])); 

            const currentTimestamp = formatDateTime(new Date().getTime());

            console.log("boolArray",boolArray)
            console.log("fbCheckArray",fbCheckArray)
    
            console.log("currentTimestamp",currentTimestamp);

            let json = JSON.stringify({
                "data": [[
                    {"column": "paragraph","value": response},
                    {"column": "Response","value": "Thumbs-Down"},
                    {"column": "Comment","value": feedbackInput.value },
                    {"column": "Additional Comment","value": fbCheckArray},
                    {"column": "DateTimeStamp","value": currentTimestamp}]]
                });
            console.log("json",json);
            
            // sendFeedback(json);
            
        });

    });

    thumbUp.addEventListener("click", () => {
        feedbackDiv.style.display="flex";
        feedbackHeaderImg.src = "pics/Like feedback.png";
        feedbackOptions.style.display="none";
        feedbackInput.value = "";
        feedbackClose.addEventListener("click", () => {
            feedbackDiv.style.display="none";
        });

        feedbackSubmit.addEventListener("click",() => {

            const currentTimestamp = formatDateTime(new Date().getTime());
    
            console.log("currentTimestamp",currentTimestamp);

            let json = JSON.stringify({
                "data": [[
                    {"column": "paragraph","value": response},
                    {"column": "Response","value": "Thumbs-Up"},
                    {"column": "Comment","value": feedbackInput.value},
                    {"column": "DateTimeStamp","value": currentTimestamp}]]
                });
            console.log("json",json);
            
            // sendFeedback(json);
            
        });
    });

};

function sendFeedback(json) {
    var accessCodeHttp= new XMLHttpRequest();
    var accessCodeUrl = 'https://api.clicdata.com/oauth20/token';
    var accessCodeParams = 'client_id=W0KWYObWCxpJz1JHGmjT65kZ&client_secret=klW2wrUBvm04Bm50BZiG3aDK3w5swHS2&grant_type=client_credentials';

    accessCodeHttp.open('POST', accessCodeUrl);
    accessCodeHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    accessCodeHttp.send(accessCodeParams);
    accessCodeHttp.onload = function(){
    var accessCodeResponse = JSON.parse(accessCodeHttp.responseText);


    //Preparing API call
    const Http = new XMLHttpRequest();
    const url = 'https://api.clicdata.com/table/'+682053+'?api_version=2021.08';
    Http.open('POST', url);
    Http.setRequestHeader('Content-type', 'application/json');
    Http.setRequestHeader('authorization', 'Bearer ' + accessCodeResponse.access_token);

    Http.send(json);
    };
}

function formatDateTime(timestamp) {
    const date = new Date(timestamp);
  
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }