package org.calpoly.gehackathon.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import static org.springframework.http.HttpHeaders.USER_AGENT;

@RestController
public class TokenController {

  @RequestMapping("/getToken")
  public String getToken() throws Exception {
    //ic.admin:admin@
    String url = "https://624eff02-dbb1-4c6c-90bc-fa85a29e5fa8.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token";

    URL obj = new URL(url);
    HttpURLConnection con = (HttpURLConnection) obj.openConnection();

    // optional default is GET
    con.setRequestMethod("GET");

    //add request header
    //con.setRequestProperty("User-Agent", USER_AGENT);
    con.setRequestProperty("Authorization", "Basic aWMuc3RhZ2Uuc2ltLmRldmVsb3A6ZGV2");
    con.setRequestProperty("Content-Type", "text/plain");
    con.setRequestProperty("Cache-Control", "no-cache");
    con.setRequestProperty("username", "ic.admin");
    con.setRequestProperty("password", "admin");

    int responseCode = con.getResponseCode();
    System.out.println("\nSending 'GET' request to URL : " + url);
    System.out.println("Response Code : " + responseCode);

    BufferedReader in = new BufferedReader(
        new InputStreamReader(con.getInputStream()));
    String inputLine;
    StringBuffer response = new StringBuffer();

    while ((inputLine = in.readLine()) != null) {
      response.append(inputLine);
    }
    in.close();

    //print result
    return response.toString();
  }
}
