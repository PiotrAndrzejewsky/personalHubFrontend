import { Time } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  public items:Item[] = [];
  public item:Item = {
    name:"",
    id:0,
    collectionId:0,
    creationTime:"",
    image:"",
    likes:0
  }
  public headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.cookieService.get("Access-Token")}`
  });
  public submitMessage:String = "";
  public isNewItem = false;

  private userId:number = 0;
  private collectionId:number = 0;
  private getAllItemsUrl = environment.baseUrl + "item/all/";
  private getLikesUrl = environment.baseUrl + "item/likes/";
  private username = this.cookieService.get("username");
  private createItemUrl = environment.baseUrl + "item/save";
  private updateItemUrl = environment.baseUrl + "item/update/";
  private updateLikesUrl = environment.baseUrl + "item/likes/update/"
  

  constructor(
    private route: ActivatedRoute,
    private http:HttpClient,
    private cookieService:CookieService,
    private app:AppComponent
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['userId'];
      this.collectionId = +params['collectionId'];
    });

    this.getAllItemsByCollectionId(this.collectionId);
  }

  getAllItemsByCollectionId(id:number) {
    this.http.get<Array<Item>>(this.getAllItemsUrl + id).subscribe(
      res => {
        this.items = res;
        for (let i = 0; i < this.items.length; i++) {
          this.http.get<number>(this.getLikesUrl + this.items[i].id).subscribe(
            res => {
              this.items[i].likes = res;
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


  newItem() {
    this.isNewItem = true;
    this.clearItem();
    this.submitMessage = "Create";
  }

  clearItem() {
    this.item = {
      name:"",
      id:0,
      collectionId:0,
      creationTime:"",
      image:"",
      likes:0
    }
  }

  editItem(item:Item) {
    this.isNewItem = true;
    this.submitMessage = "Update";
    this.item = item;
  }

  deleteItem(itemId:number) {

  }

  hide() {
    this.isNewItem = false;
  }

  submit() {
    if (this.submitMessage == "Create") {
      this.createItem();
    }
    else {
      this.updateItem();
    }
  }

  createItem() {
    if (this.item.name == "") {
      alert("Name filed can not be empty");
    }
    else {
      this.item.collectionId = this.collectionId;
      this.http.post(this.createItemUrl, this.item, {headers: this.headers}).subscribe(
        res => {
          window.location.reload();
        },
        err => {
          if (err.status == 403) {
            if (this.app.refreshToken()) {
              this.createItem();
            }
          }
          else {
            alert("Something went wrong, try again later!")
          }
        }
      )
    }
  }

  updateItem() {
    if (this.item.name == "") {
      alert("Name filed can not be empty");
    }
    else {
      this.http.put(this.updateItemUrl + this.item.id, this.item, {headers: this.headers}).subscribe(
        res => {
          window.location.reload();
        },
        err => {
          if (err.status == 403) {
            if (this.app.refreshToken()) {
              this.createItem();
            }
          }
          else {
            alert("Something went wrong, try again later!")
          }
        }
      )
    }
  }

  like(itemId:number) {
    this.http.post(this.updateLikesUrl + itemId + "/" + this.userId, null, {headers: this.headers}).subscribe(
      res => {
        window.location.reload();
      },
      err => {
        if (err.status == 403) {
          if (this.app.refreshToken()) {
            this.like(itemId);
          }
        }
        else {
          alert("Something went wrong, try again later!")
        }
      }
    )
  }
}

export interface Item{
  name:string,
  id:number,
  collectionId:number,
  creationTime:string,
  image:string,
  likes:number
}
