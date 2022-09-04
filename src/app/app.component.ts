import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'personalHubFrontend';

  public headers= new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem("Refresh-Token")}`
  }); 

  private refreshUrl = environment.baseUrl + "user/refresh";
  private loginUrl = environment.baseFrontendUrl + "login";

  constructor(
    private http:HttpClient,
    private cookieService:CookieService
  ) {}

  refreshToken(): boolean {
    if (this.cookieService.get("Access-Token") == "") {
      alert("Guest user can not perform that!")
    }
    else{
      this.http.get(this.refreshUrl, {observe: 'response', headers: this.headers},).subscribe(
        res => {
          this.cookieService.set("Access-Token", res.headers.get("Access-Token")!);
          this.cookieService.set("Refresh-Token", res.headers.get("Refresh-Token")!);
          return true;
        },
        err => {
          alert("Your token has expired, login again")
          window.location.href = this.loginUrl;
        }
      )
    }
    return false;
  }
}
