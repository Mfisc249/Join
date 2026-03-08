
function startLoadingScreen() {
    document.getElementById("field1").insertAdjacentHTML('beforeend', `<img id="loadingscreenBoard" class ="loadingscreenBoard" src="./assets/img/loading-3-bars.svg" alt="Loadingscreen"></img>`);
}

// function stopLoadingScreen() {
//     let refLoadingscreenBoard = document.getElementById("loadingscreenBoard");
//     if (refLoadingscreenBoard != null || refLoadingscreenBoard != undefined) {
//         refLoadingscreenBoard.remove();
//     }
    
// }

function startLoadingScreenMobile() {
    document.getElementById("field1").insertAdjacentHTML('beforeend', `<img class ="loadingscreenBoardMobile" src="./assets/img/loading-3-bars.svg" alt="Loadingscreen"></img>`);
    document.getElementById("field2").insertAdjacentHTML('beforeend', `<img class ="loadingscreenBoardMobile" src="./assets/img/loading-3-bars.svg" alt="Loadingscreen"></img>`);
    document.getElementById("field3").insertAdjacentHTML('beforeend', `<img class ="loadingscreenBoardMobile" src="./assets/img/loading-3-bars.svg" alt="Loadingscreen"></img>`);
    document.getElementById("field4").insertAdjacentHTML('beforeend', `<img class ="loadingscreenBoardMobile" src="./assets/img/loading-3-bars.svg" alt="Loadingscreen"></img>`);
}


// function stopLoadingScreenMobile() {
//     let refLoadingscreenBoardMobile = document.querySelectorAll("loadingscreenBoardMobile");
//     if (refLoadingscreenBoardMobile != null || refLoadingscreenBoardMobile != undefined) {
//         refLoadingscreenBoardMobile.remove();
//     }
    
// }