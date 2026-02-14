function loginHtml() {
    return `<div id="logoAnimation" class="logoAnimation">
        <img src="/assets/icons/logo-login-start.svg" alt="logo">
      </div>    

<nav class="loginNav">
    <div class="loginNewUserWrapper">
        <span>Not a Join user?</span>
        <a href="signup.html" class="ButtonBlueFilled" style="text-decoration:none;">Sign up</a>
    </div>
</nav>

<main class="loginMainContainer">
    <div class="loginCard">
        <h1>Log in</h1>
        <div class="Separator"></div>
        <form novalidate>
            <div class="loginInputs">
                <div class="InputWrapper" >
                    <label for="loginEmail" class="visuallyhidden">Email</label>
                    <input id="loginEmail" class="InputField" autocomplete="username" type="email" placeholder="Email">
                    <img class="InputFieldIcon" src="./assets/img/mail.svg" alt="Email Icon">
                </div>
                <div class="InputWrapper">
                    <label for="loginPassword" class="visuallyhidden">Password</label>
                    <input id="loginPassword" class="InputField" autocomplete="current-password" type="password" placeholder="Password">
                    <img class="InputFieldIcon" src="./assets/img/lock.svg" alt="Password Icon">
                </div>
                <span id="loginError" class="InputErrorText"></span>
                <div class="loginButtonsWrapper">
                        <button class="ButtonBlueFilled" type="submit" id="loginButton">Log in</button>
                        <button class="ButtonWhiteBlueOutline" type="button" id="guestButton">Guest Log in</button>
                </div>
            </div>
        </form>
    </div>
</main>`
}