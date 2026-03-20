
function startLoadingScreen() {
    document.getElementById("field1").insertAdjacentHTML('beforeend', `<img id="loadingscreenBoard" class ="loadingscreenBoard" src="./assets/img/loading-3-bars.svg" alt="Loadingscreen"></img>`);
}


function startLoadingScreenMobile() {
    document.getElementById("field1").insertAdjacentHTML('beforeend', `<img class ="loadingscreenBoardMobile" src="./assets/img/loading-3-bars.svg" alt="Loadingscreen"></img>`);
    document.getElementById("field2").insertAdjacentHTML('beforeend', `<img class ="loadingscreenBoardMobile" src="./assets/img/loading-3-bars.svg" alt="Loadingscreen"></img>`);
    document.getElementById("field3").insertAdjacentHTML('beforeend', `<img class ="loadingscreenBoardMobile" src="./assets/img/loading-3-bars.svg" alt="Loadingscreen"></img>`);
    document.getElementById("field4").insertAdjacentHTML('beforeend', `<img class ="loadingscreenBoardMobile" src="./assets/img/loading-3-bars.svg" alt="Loadingscreen"></img>`);
}
