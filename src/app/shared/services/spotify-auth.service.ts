import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class SpotifyAuthService {

    constructor(private http : HttpClient, private route : ActivatedRoute) {}
    data: any;

    //Map for localStorage keys
    LOCALSTORAGE_KEYS = {
        accessToken: 'spotify_access_token',
        refreshToken: 'spotify_refresh_token',
        expireTime: 'spotify_token_expire_time',
        timestamp: 'spotify_token_timestamp'
    }

    //Map for retrieve localStorage values
    LOCALSTORAGE_VALUES = {
        accessToken: window
            .localStorage
            .getItem(this.LOCALSTORAGE_KEYS.accessToken),
        refreshToken: window
            .localStorage
            .getItem(this.LOCALSTORAGE_KEYS.refreshToken),
        expireTime: window
            .localStorage
            .getItem(this.LOCALSTORAGE_KEYS.expireTime),
        timestamp: window
            .localStorage
            .getItem(this.LOCALSTORAGE_KEYS.timestamp)
    }

    /**
 * Clear out all localStorage items we've set and reload the page
 * @returns {void}
 */
    logout() {
        // Clear all localStorage items
        window.localStorage.removeItem(this.LOCALSTORAGE_KEYS.accessToken);
        window.localStorage.removeItem(this.LOCALSTORAGE_KEYS.refreshToken);
        window.localStorage.removeItem(this.LOCALSTORAGE_KEYS.expireTime);
        window.localStorage.removeItem(this.LOCALSTORAGE_KEYS.timestamp);

        // Navigate to homepage
        //! כשהמשתמש התנתק, להעביר אותו בהמשך לעמוד שיראה שהוא התנתק ותהיה לו אפשרות להתחבר שוב
        // window.location.href = "http://localhost:8888";
        // window.location.href = "http://google.com";
    };

    /**
 * Checks if the amount of time that has elapsed between the timestamp in localStorage
 * and now is greater than the expiration time of 3600 seconds (1 hour).
 * @returns {boolean} Whether or not the access token in localStorage has expired
 */
    hasTokenExpired() {
        const {accessToken, timestamp, expireTime} = this.LOCALSTORAGE_VALUES;
        if (!accessToken || !timestamp) {
            return false;
        }
        const millisecondsElapsed = Date.now() - Number(timestamp);
        return (millisecondsElapsed / 1000) > Number(expireTime);
    };

    /**
 * Use the refresh token in localStorage to hit the /refresh_token endpoint
 * in our Node app, then update values in localStorage with data from response.
 * @returns {void}
 */
    async refreshToken() : Promise < any > {
        try {
            // Logout if there's no refresh token stored or we've managed to get into a
            // reload infinite loop
            if (!this.LOCALSTORAGE_VALUES.refreshToken || this.LOCALSTORAGE_VALUES.refreshToken === 'undefined' || (Date.now() - Number(this.LOCALSTORAGE_VALUES.timestamp) / 1000) < 1000) {
                console.error('No refresh token available');
                this.logout();
            }

            this.getRefreshToken().subscribe(res => {
                this.data = res;
                // Update localStorage values
                window
                    .localStorage
                    .setItem(this.LOCALSTORAGE_KEYS.accessToken, this.data.access_token);
                    window
                    .localStorage
                    .setItem(this.LOCALSTORAGE_KEYS.timestamp, Date.now().toString());
                    
                    // Reload the page for localStorage updates to be reflected
                    window
                    .location
                    .reload();
                })
                
            } catch (e) {
                console.error(e);
            }
        };
        
        // Use `/refresh_token` endpoint from our Node app
        getRefreshToken() : Observable < any > {
        return this.http.get(`/refresh_token?refresh_token=${this.LOCALSTORAGE_VALUES.refreshToken}`);
    }

    /**
 * Handles logic for retrieving the Spotify access token from localStorage
 * or URL query params
 * @returns {string} A Spotify access token
 */
    getAccessToken() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const queryParams = {
            [this.LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
            [this.LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
            [this.LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in')
        };
        const hasError = urlParams.get('error');

        // If there's an error OR the token in localStorage has expired, refresh the
        // token
        if (hasError || this.hasTokenExpired() || this.LOCALSTORAGE_VALUES.accessToken === 'undefined') {
            this.refreshToken();
        }

        // If there is a valid access token in localStorage, use that
        if (this.LOCALSTORAGE_VALUES.accessToken && this.LOCALSTORAGE_VALUES.accessToken !== 'undefined') {
            return this.LOCALSTORAGE_VALUES.accessToken;
        }

        // If there is a token in the URL query params, user is logging in for the first
        // time
        if (queryParams[this.LOCALSTORAGE_KEYS.accessToken]) {
            // Store the query params in localStorage
            window.localStorage.setItem(this.LOCALSTORAGE_KEYS.accessToken,(queryParams[this.LOCALSTORAGE_KEYS.accessToken] || '').toString());
            window.localStorage.setItem(this.LOCALSTORAGE_KEYS.refreshToken,(queryParams[this.LOCALSTORAGE_KEYS.refreshToken] || '').toString());
            window.localStorage.setItem(this.LOCALSTORAGE_KEYS.expireTime,(queryParams[this.LOCALSTORAGE_KEYS.expireTime] || '').toString());
            // Set timestamp
            window.localStorage.setItem(this.LOCALSTORAGE_KEYS.timestamp, Date.now().toString());
            // Return access token from query params
            return queryParams[this.LOCALSTORAGE_KEYS.accessToken];
        }

        // We should never get here!
        return false;
    };
}