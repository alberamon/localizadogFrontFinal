import { Component, OnInit } from '@angular/core';
import { Content } from '../../interfaces/interfaces';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage {

  posts: Content[] = [];

  postsFavoritos: Content[] = [];

  habilitado = true;

  listaFav: number[] = [];

  constructor( private postsService: PostsService) {}

  ionViewWillEnter() {
    this.recargar();
  }

  recargar( event? ) {
      this.siguientes( event, true );
      this.habilitado = true;
      this.posts = [];
  }

  siguientes( event?, pull: boolean = false ) {
    this.postsService.getPosts( pull )
    .subscribe( resp => {
      this.posts.push( ...resp.posts.content );

      this.postsService.getFavoritos()
      .subscribe( favoritos => {
        this.listaFav = [];
        this.postsFavoritos = [];
        if ( favoritos.ok !== false ) {
          this.listaFav.push( ...favoritos.posts );
        }

        for (const fav of Object.keys(this.listaFav)) {
          this.postsFavoritos.push(...this.posts.filter( post => post.id === this.listaFav[fav]));
        }

        this.postsFavoritos.sort( (n1, n2) => n2.fechaCreacion - n1.fechaCreacion);
      });

      if ( event ) {
        event.target.complete();

        if ( resp.posts.content.length === 0) {
          this.habilitado = false;
        }
      }
    });
  }
}
