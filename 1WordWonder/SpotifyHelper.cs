using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SpotifyWebAPI;

namespace _1WordWonder
{
    public class SpotifyHelper
    {
        public void AuthenticationToken()
        {
            var AuthenticationToken = new AuthenticationToken()
            {
                AccessToken = "NgCXRK...MzYjw",
                ExpiresOn = DateTime.Now.AddSeconds(3600),
                RefreshToken = "dfagC...fd43x",
                TokenType = "Bearer"
            };

            // get the user you just logged in with
            var user = SpotifyWebAPI.User.GetCurrentUserProfile(AuthenticationToken);

            // get this persons playlists
            
        }
    }
}