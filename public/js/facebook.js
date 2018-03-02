function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

function changeUser(response) {  
  resetGo();
  localStorage.setItem("name", response.name);
 // localStorage.setItem("profile-pic", response.picture.data.url);
  localStorage.setItem("id", response.id);
  localStorage.setItem("loggedIn", true);
  window.location.href = "/login/" + response.id;
}

function statusChangeCallback(response) {
  console.log('Facebook login status changed.');
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
        console.log('Successfully logged in with Facebook');
         FB.api('/me?fields=id,name,first_name,picture.width(480)', changeUser);
  }
}