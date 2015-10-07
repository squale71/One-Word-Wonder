using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace _1WordWonder
{
    public class XboxMusicAPI
    {
                        //datamarket authentication endpoint, must be https
            string service = "https://datamarket.accesscontrol.windows.net/v2/OAuth2-13";

            //the clientId from step 5
            string clientId = "myClient";

            //the secret from step 5
            string clientSecret = "REDACTED";
            string clientSecretEnc = System.Uri.EscapeDataString(clientSecret);

            //will be used to store the authentication token
            string token = null;
            string tokenEnc = null;
            HttpWebRequest request = null;
            HttpWebResponse response = null;

            // scope used for authentication. NOTE: http. not https here!
            string scope = "http://music.xboxlive.com";
            string scopeEnc = System.Uri.EscapeDataString(scope);

            string grantType = "client_credentials";

            //preparing the data for authentication
            string postData = "client_id=" + clientId + "&client_secret=" + clientSecretEnc + "&scope=" + scopeEnc + "&grant_type=" + grantType;

              static string SendRequest(string method, string service, string postData)
              {

                  string responseString = null;
                  HttpWebRequest request = (HttpWebRequest)WebRequest.Create(service);

                  UTF8Encoding encoding = new UTF8Encoding();
                  byte[] data = encoding.GetBytes(postData);

                  request.Method = method;
                  request.ContentType = "application/x-www-form-urlencoded";
                  request.ContentLength = data.Length;

                  using (Stream stream = request.GetRequestStream())
                  {
                      stream.Write(data, 0, data.Length);
                  }

                  using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                  {
                      responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
                  }

                  return responseString;
              }

            //send the authentication request
            string responseString = SendRequest("POST", service, postData);

            static string ExtractTokenFromJson(string json)
              {
                  string token = null;
                  Match match = Regex.Match(json, ".*\"access_token\":\"(?<token>.*?)\".*", RegexOptions.IgnoreCase);
                  if (match.Success)
                  {
                      token = match.Groups["token"].Value;
                  }
                  return token;
              }

            //token to use to authenticate aginst the Xbox Music API
            token = ExtractTokenFromJson(responseString);
            
            //token will be used in the REST call, it hsould be encoded
            tokenEnc = HttpUtility.UrlEncode(token);

            //and the request to the API (Note: the API endpoint is https)
              request = (HttpWebRequest)WebRequest.Create("https://music.xboxlive.com/1/content/music/search?q=daft+punk&accessToken=Bearer+" + tokenEnc);
              request.Method = WebRequestMethods.Http.Get;
              request.Accept = "application/json";
              using (response = (HttpWebResponse)request.GetResponse())
              {
                  using (var sr = new StreamReader(response.GetResponseStream()))
                  {
                      responseString = sr.ReadToEnd();
                  }
              }
            Console.WriteLine(responseString);
        
    }
}