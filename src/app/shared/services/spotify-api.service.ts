import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpotifyAuthService } from './spotify-auth.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {
  authToken = this.spotifyAuthService.getAccessToken();

  headers = ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.authToken}`
  });

 requestOptions = { headers: this.headers };

  constructor(private http: HttpClient,
              private spotifyAuthService: SpotifyAuthService) { }

  //!Users

  getUserProfile(){
    return this.http.get('https://api.spotify.com/v1/me', this.requestOptions).subscribe(res => {
      console.log(res);
      return res;
    });
  }

  getUserTopArtists(limit? : number, time_range? : string){
    if(limit === undefined) limit = 20;
    if(time_range === undefined) time_range = 'medium_term';
    return this.http.get(`https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=${time_range}`, this.requestOptions).subscribe(res => {
      console.log(res);
      return res;
    });
  }

  getUserTopTracks(limit? : number, time_range? : string){
    if(limit === undefined) limit = 20;
    if(time_range === undefined) time_range = 'medium_term';
    return this.http.get(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${time_range}`, this.requestOptions).subscribe(res => {
      console.log(res);
      return res;
    });
  }

  // getUsersFollowedArtists(limit? : number){
  //   if(limit === undefined) limit = 20;
  //   return this.http.get(`https://api.spotify.com/v1/me/following?type=artist&limit=${limit}`, this.requestOptions).subscribe(res => {
  //     console.log(res);
  //     return res;
  //   });
  // }

  //!Albums

  // getUsersSavedAlbums(limit? : number){
  //   if(limit === undefined) limit = 20;
  //   return this.http.get(`https://api.spotify.com/v1/me/albums?limit=${limit}`, this.requestOptions).subscribe(res => {
  //     console.log(res);
  //     return res;
  //   });
  // }

  // getAlbumTracksByAlbumId(id : string){
  //   return this.http.get(`https://api.spotify.com/v1/albums/${id}/tracks`, this.requestOptions).subscribe(res => {
  //     console.log(res);
  //     return res;
  //   });
  // }

  // make it show on the first page after logging in
  getNewReleases(limit? : number){
    if(limit === undefined) limit = 20
    return this.http.get(`https://api.spotify.com/v1/browse/new-releases?limit=${limit}`, this.requestOptions).subscribe(res => {
      console.log(res);
      return res;
    });
  }
  
  //!Artists
  getArtistsTopTracks(id : string){
    return this.http.get(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=IL`, this.requestOptions).subscribe(res => {
      console.log(res);
      return res;
    });
  }

  getArtistsAlbumsByArtistId(id : string){
    return this.http.get(`https://api.spotify.com/v1/artists/${id}/albums`, this.requestOptions).subscribe(res => {
      console.log(res);
      return res;
    });
  }

  getArtistsRelatedArtists(id : string){
    return this.http.get(`https://api.spotify.com/v1/artists/${id}/related-artists?limit=5`, this.requestOptions).subscribe(res => {
      console.log(res);
      return res;
    });
  }

  //!Player
  // getUsersSavedTracks(id : string){
  //   return this.http.get(`https://api.spotify.com/v1/me/tracks`, this.requestOptions).subscribe(res => {
  //     console.log(res);
  //     return res;
  //   });
  // }




}


