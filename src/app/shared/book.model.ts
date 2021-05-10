export class Book {
    title: string = "";
    author: string = "";
    isbn: number = 0;
    first_pub: number = 0;
    main_subject: string[];
    languages: string[];
    cover: string;
    author_key: string;

    constructor(){
        this.author = "";
        this.title = "";
        this.isbn = 0;
        this.first_pub = 0;
        this.languages = [];
        this.main_subject = [];
        this.cover = "";
        this.author_key = "";
    }
}
