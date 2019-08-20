var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
    signInSuccessUrl : 'game.html',
        signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.GoogleAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      requireDisplayName: true,
    }
  ]
});


if (ui.isPendingRedirect()) {
  ui.start('#firebaseui-auth-container', uiConfig);
}




