app.service("tokenService", function($http) {

  let ONE_DAY_IN_MILLISECONDS = 1000 * 24 * 60 * 60;

  /**
   * @return false if the current token is expiring in a day.
   * */
  this.isValidToken = function () {
    return Date.now() < config.expire_time - ONE_DAY_IN_MILLISECONDS;
  };

  /**
   * If the current token is invalid, make a HTTP request to update the token and the expire_time.
   * */
  this.checkAndUpdateToken = function () {
    if (config.token != null && isValidToken()) {
      return config.token;
    }

    $http({
      method: "GET",
      async: false,
      crossDomain: true,
      url: "https://"+config.username+":"+config.password+"@624eff02-dbb1-4c6c-90bc-fa85a29e5fa8.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token",
      headers: {
        Authorization: "Basic aWMuc3RhZ2Uuc2ltLmRldmVsb3A6ZGV2",
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
        //"Postman-Token": "066ca1f1-6731-b0a6-cade-a20920d0b902"
      }/*,
      data: {
        "username": config.username,
        "password": config.password
      }*/
    })
    .then( function (tokenInfo) {
      config.token = tokenInfo["access_token"];
      config.expire_time = tokenInfo["expires_in"] + Date.now();
      console.log(JSON.stringify(tokenInfo));
    }, function(error) {
      console.log("Rejected");
      console.log(error);
    });
  }
});