import { Component, OnInit, Input } from '@angular/core';
import { Content } from '../../interfaces/interfaces';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {

  @Input() posts: Content[] = [];
  @Input() permLoc: boolean;

  listaFav = [];

  constructor() { }

  ngOnInit() {
  }

}
