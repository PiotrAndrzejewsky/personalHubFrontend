import { HttpClient} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model:LoginViewModel = {
    username:"",
    password:""
  };

  private loginUrl = environment.baseUrl + "user/login";
  private signUpUrl = environment.baseFrontendUrl + "signUp";
  private userIdUrl = environment.baseUrl + "user/";
  private usersPage = environment.baseFrontendUrl + "user/";

  constructor(private http:HttpClient, private cookieService: CookieService) { 

  }

  ngOnInit(): void {
  }
  sendLoginRequest(): void{
    this.http.post(this.loginUrl, this.model, {observe: 'response'}).subscribe(
      res =>  {
        this.cookieService.set("Access-Token", res.headers.get("Access-Token")!);
        this.cookieService.set("Refresh-Token", res.headers.get("Refresh-Token")!);
        this.cookieService.set("username", this.model.username);
        let id;
        this.http.get<number>(this.userIdUrl + this.model.username, {observe: 'response'}).subscribe(
          res => {
            id = res.body;
            window.location.href = this.usersPage + id;
          },
          err => {
            alert("Something went wrong, try again!");
          }
          
        );
      },
      err => {
        alert("Wrong credentials");
      }
    );
  }

  goToSignUp(): void {
    window.location.href = this.signUpUrl;
  }
}

export interface LoginViewModel {
  username:string;
  password:string;
}