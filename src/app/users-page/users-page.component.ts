import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { HttpHeaders } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { waitForAsync } from '@angular/core/testing';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {

  collectionModel:CollectionViewModel = {
    userId: 0,
    name: "",
    description: "",
    topic: 0,
    image: ""
  }

  collection:Collection = {
    name:"",
    id:0,
    description:"",
    likes:0,
    topic:0,
    image:"",
  }

  public submitMessage = "";

  public collections:Collection[] = [];
  public topics:Topic[] = [];
  public headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.cookieService.get("Access-Token")}`
  });
  public isNewForm:boolean = false;

  private id:number = 0;
  private getAllCollectionsUrl = environment.baseUrl + "collections/";
  private getLikesUrl = environment.baseUrl + "collections/likes/";
  private username = this.cookieService.get("username");
  private collectionUrl = environment.baseFrontendUrl + "collection/";
  private topicUrl = environment.baseUrl + "collection/topic/all";
  private deleteCollectionUrl = environment.baseUrl + "collection/delete/";
  private createCollectionUrl = environment.baseUrl + "collection";
  private updateCollectionUrl = environment.baseUrl + "collection/update/";
  private likeCollectionUrl = environment.baseUrl + "collection/likes/update/"

  constructor(
    private route: ActivatedRoute,
    private http:HttpClient,
    private cookieService:CookieService,
    private app:AppComponent
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.getAllTopics();
    this.getAllCollectionsByUserId(this.id);
  }

  getAllTopics() {
    this.http.get<Array<Topic>>(this.topicUrl).subscribe(
      res => {
        this.topics = res;
      }
    )
  }

  getAllCollectionsByUserId(id:number) {
    this.http.get<Array<Collection>>(this.getAllCollectionsUrl + id).subscribe(
      res => {
        this.collections = res;
        for (let i = 0; i < this.collections.length; i++) {
          this.http.get<number>(this.getLikesUrl + this.collections[i].id).subscribe(
            res => {
              this.collections[i].likes = res;
            },
            err => {
              alert("Something went wrong, try again later")
            }
          )
        }
      },
      err => {
        if (this.username == undefined) {
          alert("User does not exist");
        }
        else {
          alert("Something went wrong");
        }
      }
    )
  }

  seeCollection(collectionId:number) {
    window.location.href = this.collectionUrl + this.id + "/" + collectionId;
  }

  editCollection(collection:Collection) {
    this.isNewForm = true;
    this.collection = collection;
    this.submitMessage = "Update";
  }

  deleteCollection(collectionId:number) {
    this.http.delete(this.deleteCollectionUrl + collectionId, {headers: this.headers}).subscribe(
      res => {
        window.location.reload();
      },
      err => {
        if (err.status == 403) {
          this.app.refreshToken();
          waitForAsync;
          this.deleteCollection(collectionId);
        }
        else {
          alert("something went wrong")
        }
      }
    )
  }

  newCollection(){
    this.isNewForm = true;
    this.clearCollection();
    this.submitMessage = "Create";
  }

  createNewCollection() {
    if (this.collectionModel.name == "" || this.collectionModel.description == "" || this.collectionModel.topic == undefined) {
      alert("All required fields must be filled");
      return;
    }
    this.collectionModel.userId = this.id;
    console.log(this.collectionModel);
    this.http.post(this.createCollectionUrl, this.collectionModel, {headers: this.headers, observe: 'response'}).subscribe(
      res => {
        if (res.status == 201) {
          alert("Collection created")
        }
        else {
          alert("Something went wrong")
        }
      },
      err => {
        if (err.status == 403) {
          if (this.app.refreshToken()) {
            this.createNewCollection();
          }
        }
        else {
          alert("Something went wrong, try again later!")
        }
      }
    )
  }

  updateCollection() {
    console.log(this.collection);
    console.log(this.collectionModel);
    if (this.collectionModel.name == "" || this.collectionModel.description == "" || this.collectionModel.topic == undefined) {
      alert("All required fields must be filled");
      return;
    }
    this.http.put(this.updateCollectionUrl + this.collection.id, this.collectionModel, {headers: this.headers, observe: 'response'}).subscribe(
      res => {
        if (res.status == 200) {
          alert("Collection updated")
        }
        else {
          alert("Something went wrong")
        }
      },
      err => {
        if (err.status == 403) {
          if (this.app.refreshToken()) {
            this.updateCollection();
          }
        }
        else {
          alert("Something went wrong, try again later!")
        }
      }
    )
  }

  clearCollection() {
    this.collection = {
      name:"",
      id:0,
      description:"",
      likes:0,
      topic:0,
      image:"",
    }
  }

  getTopic(collectionId:number):String {
    for (let topic of this.topics) {
      if (topic.id == collectionId) {
        return topic.topic;
      }
    }
    return "";
  }

  submit() {
    if (this.submitMessage == "Create") {
      this.createNewCollection();
    }
    else {
      this.updateCollection();
    }
  }

  like(collectionId:number) {
    this.http.post(this.likeCollectionUrl + this.id + "/" + collectionId, null, {headers: this.headers}).subscribe(
      res => {
        window.location.reload();
      },
      err => {
        if (err.status == 403) {
          if (this.app.refreshToken()) {
            this.like(collectionId);
          }
        }
        else {
          alert("Something went wrong, try again later!")
        }
      }
    )
  }

  hide() {
    this.isNewForm = false;
  }
}

export interface Collection{
  name:string,
  id:number,
  description:string,
  likes:number,
  topic:number,
  image:string,
}

export interface Topic{
  id:number
  topic:string
}

export interface CollectionViewModel{
  userId:number,
  name:string,
  description:string,
  topic:number,
  image:string,
}
