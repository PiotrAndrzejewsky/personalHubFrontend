import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  model:SignUpViewModel = {
    username:"",
    password1:"",
    password2:""
  };

  signUpModel:SingUpModel = {
    username:"",
    password:""
  }

  private loginUrl = environment.baseFrontendUrl + "login";
  private signUpUrl = environment.baseUrl + "user/save";

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  signUp(): void {
    
    if (this.model.username == "" || this.model.password1 == "" || this.model.password2 == "") {
      alert("all fields must be filled")
      return;
    }
    if (this.model.password1 == this.model.password2) {
      this.signUpModel.username = this.model.username
      this.signUpModel.password = this.model.password1;
    }
    else {
      alert("password do not match");
      return;
    }
    this.http.post<boolean>(this.signUpUrl, this.signUpModel).subscribe(
      res => {
        alert("User was created");
        window.location.href = this.loginUrl;
      },
      err => {
        alert("Something went wrong, try again");
      }
    );
  }

  goToLogin() {
    window.location.href = this.loginUrl;
  }

}
export interface SignUpViewModel {
  username:string;
  password1:string;
  password2:string;
}

export interface SingUpModel {
  username:string;
  password:string;
}
