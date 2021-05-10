import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../shared/book.model';
import { BookService } from '../shared/book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  book: Book;
  url: string;
  
  constructor(private route: ActivatedRoute, public bookService: BookService) { }

   ngOnInit(): void {
    this.book = new Book();
    this.book = this.bookService.getActualBook();
  }

  async picGrown(page: string){
    var pic = document.getElementById("cover") as HTMLImageElement;
    pic.src = page;
    pic.style.visibility = "visible";
    await this.delay(3000);
    pic.style.visibility = "hidden";
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
