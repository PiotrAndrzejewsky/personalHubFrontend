import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UsersPageComponent } from './users-page/users-page.component';
import { CollectionComponent } from './collection/collection.component';

const appRoutes :Routes = [
  {
  path:"login",
  component:LoginComponent
  },
  {
    path:"signUp",
    component:SignUpComponent
  },
  {
    path:"user/:id",
    component:UsersPageComponent
  },
  {
    path:"collection/:userId/:collectionId",
    component:CollectionComponent
  },
  {
    path:"**",
    component:NotFoundComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    NotFoundComponent,
    UsersPageComponent,
    CollectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
