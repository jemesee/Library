import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookComponent } from '../book/book.component';
import { Book } from '../shared/book.model';
import { BookService } from '../shared/book.service';

@Component({
  providers: [BookComponent],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title: string = "";
  author: string = "";
  default: string = "";
  bookList: Book[];
  truth: boolean = true;

  constructor(public bookService: BookService, private route: ActivatedRoute, 
    private router: Router, private toastr: ToastrService) { 
  } 

  async ngOnInit(): Promise<void> {
    await this.route.queryParams.subscribe(params => {              //URL-ből az adatokat bekötjük
      this.title = params['title'];
      this.author = params['author'];
      this.default = params['default'];
    });

    this.search()
  }



  async GetParams(){                                              //Akkor fut le, ha a home komponensen vagyunk 
    //this.bookList.length = 0;                                     //és újabb keresést akarunk lefuttatni
    await this.route.queryParams.subscribe(params => {
      this.title = params['title'];
      this.author = params['author'];
      this.default = params['default'];
    });
    this.search()
  }

  async search(){
    document.getElementById("confused").style.display = "none";

    if(this.author === "" && this.default === "" && this.title === ""){     //Ha nincs keresési feltétel megadva
      document.getElementById("confused").style.display = "block";
      this.toastr.warning("Kell valami információ, ami alapján keresni tudok", "Rossz keresés")
      return
    }

    if(this.author === "" && this.default === ""){                         //Megvan adva cím, amire keressünk
      console.log("search title:" +  this.title);
      this.bookList = await this.bookService.searchBookByTitle(this.title);
      return;
    }

    if(this.title === "" && this.default === ""){                          //Meg van adva szerző, amire keressünk
      console.log("search author:" + this.author);
      this.bookList = await this.bookService.searchBookByAuthor(this.author);
      return;
    }

    if(this.title === "" && this.author === ""){                           //Bármi másra keresnénk
      this.bookList = await this.bookService.searchDefault(this.default);
      console.log("search default: " + this.default);
      return;
    }
  }
  
  async picGrown(page: string){                                           //rákattintunk a képre, akkor megjelenjen 
    var pic = document.getElementById("cover") as HTMLImageElement;       //nagy felbontásban
    pic.src = page;
    pic.style.visibility = "visible";
    await this.delay(3000);
    pic.style.visibility = "hidden";
  }

  delay(ms: number) {                                                     //3 másodpercig látszik a nagyított kép,
    return new Promise( resolve => setTimeout(resolve, ms) );             //majd etltűnik
  }

  goToBook(title: string, isbn: number){                                  //átirányít a megfelelő könyv oldalára
    console.log("isbn" + isbn);
    var actualBook = new Book();                                          //isbn alapján kikeresi, hogy melyik könyv az
    for(let i = 0; i < this.bookList.length; i++){
      if(this.bookList[i].isbn == isbn)
        actualBook = this.bookList[i];
    }

    console.log(actualBook);
    this.bookService.setActualBook(actualBook)                           //Serviceben elmenti, hogy melyik könyv
    this.router.navigate(['/book'], {queryParams: {book: title}});      //így azt le tudja kérni a Book komponens
  }
}
