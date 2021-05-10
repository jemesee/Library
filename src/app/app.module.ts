import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BookService } from './shared/book.service';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { BookComponent } from './book/book.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    MainComponent,
    BookComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: MainComponent },
      { path: 'navbar', component: NavbarComponent },
      { path: 'home', component: HomeComponent },
      { path: 'main', component: MainComponent },
      { path: 'book', component: BookComponent }
    ]),
    NgbModule
  ],
  providers: [BookService, BookComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }


/*  narancs: #fcb900;
    kék: rgb(0, 195, 255);
    szürke: #f7f7f7 */