import { Component } from '@angular/core';
import { SpotifyAuthService } from './shared/services/spotify-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  url: string = 'http://localhost:8888/';
  accessToken: any;
  queryString = '';
  urlParams: any; 
  homeRoute = '';
  defultRoute = '/login';

  constructor(private spotifyAuthService: SpotifyAuthService){}

  ngOnInit(){
    // צריך להבין איך להאזין לשינוי של הטוקן כדאי לקרוא לפעולה ריפרש טוקן כמו יוז אפקט בריאקט
    this.accessToken = this.spotifyAuthService.getAccessToken();
  }

}
