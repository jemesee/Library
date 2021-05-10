import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Book } from './book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  formData: any;
  readonly rootURL = "http://openlibrary.org/search.json?q=";
  onebook = new Book();
  list: Book[] = [];
  actualBook = new Book();

  constructor(private http: HttpClient) {
  }

  searchBookByTitle(title) {            //Összerakjuk a megfelelő URL és lefutattjuk a keresést
    var titleUrl = "http://openlibrary.org/search.json?title=" + title;
    this.searchProcess(titleUrl);
    return this.list;
  }

  searchBookByAuthor(author) {
    var authorUrl = "http://openlibrary.org/search.json?author=" + author;
    this.searchProcess(authorUrl);
    return this.list;
  } 

  searchDefault(def) {
    var defUrl = "http://openlibrary.org/search.json?q=" + def;
    this.searchProcess(defUrl);
    return this.list;
  } 

  async searchProcess(data: string){
    this.list.length = 0;
    await fetch(data)
      .then(a => a.json())
      .then(response => {                         //A választ feldolgozzuk
        for (var i = 0; i < 15; i++) {
          this.onebook = new Book();
                                                                                           //Mivel egy könyvnek címe biztosan van, 
          var matchAuthor = JSON.stringify(response.docs[i]).includes("author_name");      //de a többi kétséges, ezért azon kívül 
          if (!matchAuthor) { this.onebook.author = "-"; }                                //mindent ellenőrzünk, hogy szerepel JSON-ben
          else { this.onebook.author = response.docs[i].author_name[0]; }                 //Ha nem akkor default értéket adunk
                                                                                          //hogy másképtt ne szálljon el a program
          this.onebook.title = response.docs[i].title;                                    

          var matchIsbn = JSON.stringify(response.docs[i]).includes("isbn");
          if (!matchIsbn) { this.onebook.isbn = 0; }
          else { this.onebook.isbn = response.docs[i].isbn[0]; }

          this.onebook.first_pub = response.docs[i].first_publish_year;

          var matchLangs = JSON.stringify(response.docs[i]).includes("language");
          if (!matchLangs) { this.onebook.languages[0] = "Nincs adat"; }
          else {
            for (let lang in response.docs[i].language) {
              this.onebook.languages[lang] = response.docs[i].language[lang];
            }
          }

          var matchSubject = JSON.stringify(response.docs[i]).includes("subject");
          if (!matchSubject) { this.onebook.main_subject[0] = "Nincs adat"; }
          else {
            let max = 0;
            for (let sub in response.docs[i].subject) {
              this.onebook.main_subject[sub] = response.docs[i].subject[sub];
              max++;
              if (max > 8) {
                max = 0;
                break;
              }
            }
          }

          this.onebook.cover = "http://covers.openlibrary.org/b/isbn/" + this.onebook.isbn + "-M.jpg"
          
          var matchAuthorKey = JSON.stringify(response.docs[i]).includes("author_key");
          if (!matchAuthorKey) { this.onebook.author_key = "Nincs adat"; }
          else {
            this.onebook.author_key = "https://openlibrary.org/authors/" + response.docs[i].author_key[0] + "/" + this.onebook.author;
          }
          
          console.log("Book" + i + ": " + JSON.stringify(this.onebook));
          this.list.push(this.onebook);
        }
      });
    return this.list;                                                       //Visszaadjuk a listát
  }

  public setActualBook(actual: Book) {
    localStorage.setItem("author", actual.author);                        //LocalStorage-ba is eltesszük, az adatokat.
    localStorage.setItem("author_key", actual.author_key);
    localStorage.setItem("cover", actual.cover);
    localStorage.setItem("firstpub", actual.first_pub.toString());
    localStorage.setItem("isbn", actual.isbn.toString());
    localStorage.setItem("languages", JSON.stringify(actual.languages));
    localStorage.setItem("subject", JSON.stringify(actual.main_subject));
    localStorage.setItem("title", actual.title);
    this.actualBook = actual;
  }

  public getActualBook() {
    if (this.actualBook.author === ""){                                    //Ha nem lenne actual-ben könyv, akkor a localStorageból szedjük elő
      this.actualBook.author = localStorage.getItem("author");             //Pl ha visszalépünk az oldalra
      this.actualBook.author_key = localStorage.getItem("author_key");     //amiután rákattintottunk egy oldalra
      this.actualBook.cover = localStorage.getItem("cover");
      this.actualBook.first_pub = parseInt(localStorage.getItem("firstpub"));
      this.actualBook.isbn = parseInt(localStorage.getItem("isbn"));
      this.actualBook.languages = JSON.parse(localStorage.getItem("languages") || "[]");
      this.actualBook.main_subject = JSON.parse(localStorage.getItem("subject") || "[]");
      this.actualBook.title = localStorage.getItem("title");
    }

    return this.actualBook;
  }

}
