import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';

@Component({
  providers:[HomeComponent],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title = "";
  author = "";
  default = ""; 

  constructor(private router: Router, private home: HomeComponent) { }

  ngOnInit(): void {
  }

  mainPage(){
    this.router.navigate(['/main'])
  }

  search(){
    this.router.navigate(['/home'], {queryParams: {title: this.title, author: this.author, default: this.default}});
    this.home.GetParams();                            //Ha a Már indítottunk egy keresést és Home oldalon vagyunk
  }                                                   //akkor is fusson le a keresés

}
