import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from 'src/app/shared/services/spotify-api.service';
import { SpotifyAuthService } from 'src/app/shared/services/spotify-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  data: any;
  url: string = 'http://localhost:8888/';

  constructor(private spotifyAuthService: SpotifyAuthService,
              private spotifyApiService: SpotifyApiService) { }

  ngOnInit(): void {
  }

  logout(){
    this.spotifyAuthService.logout();
    }

  click(){
    this.data = this.spotifyApiService.getUserTopTracks(4);
  }
}
