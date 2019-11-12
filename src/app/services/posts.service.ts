import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RespuestaPosts, Content, Comentario, RespuestaFav, CreatePostResponse } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Storage } from '@ionic/storage';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  paginaPosts = -1;
  paginaComentarios = -1;

  postActual;
  resultado;

  borrarPost = new EventEmitter<Content>();
  idPost;

  filtro: any = {
    checkTodos: false,
    checkGeo: false
  };

  opciones: any = {
    localidad: '',
    provincia: '',
    pais: 'España',
    comunidad: '',
    distancia: 50
  };

  constructor( private http: HttpClient,
               private usuarioService: UsuarioService,
               // tslint:disable-next-line: deprecation
               private fileTransfer: FileTransfer,
               private storage: Storage) {}

  getPosts( pull: boolean = false ) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.usuarioService.token
    });

    if ( pull ) {
      this.paginaPosts = -1;
    }

    this.paginaPosts++;

    return this.http.get<RespuestaPosts>(`${ URL }/api/posts?page=${this.paginaPosts}&size=7`, { headers });
  }

 /* getPostsComunidad( pull: boolean = false ) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.usuarioService.token
    });

    if ( pull ) {
      this.paginaPosts = -1;
    }

    this.paginaPosts++;


    return this.http.get<RespuestaPosts>(`${ URL }/api/posts/comunidad/${this.opciones.comunidad}?page=${this.paginaPosts}&size=7`, { headers });
  }

  getPostsProvincia( pull: boolean = false ) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.usuarioService.token
    });

    if ( pull ) {
      this.paginaPosts = -1;
    }

    this.paginaPosts++;

    return this.http.get<RespuestaPosts>(`${ URL }/api/posts/provincia/${this.opciones.provincia}?page=${this.paginaPosts}&size=7`, { headers });
  }

  getPostsLocalidad( pull: boolean = false ) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.usuarioService.token
    });

    if ( pull ) {
      this.paginaPosts = -1;
    }

    this.paginaPosts++;

    return this.http.get<RespuestaPosts>(`${ URL }/api/posts/localidad/${this.opciones.localidad}?page=${this.paginaPosts}&size=7`, { headers });
  }*/

  getPostsCoordenadas( pull: boolean = false, coordenadas ) {
    if (this.opciones === null) {
      this.opciones.distancia = 50;
    }
    coordenadas = coordenadas + ',' + this.opciones.distancia;
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.usuarioService.token,
      Coordenadas: coordenadas
    });

    if ( pull ) {
      this.paginaPosts = -1;
    }

    this.paginaPosts++;
    return this.http.get<RespuestaPosts>(`${ URL }/api/posts/coordenadas?page=${this.paginaPosts}&size=7`, { headers });
  }

  getPostId() {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.usuarioService.token
    });

    return this.http.get<RespuestaPosts>(`${ URL }/api/posts/${this.postActual.id}`, { headers });
  }

  crearPost( post, imagenesPost ) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.usuarioService.token
    });

    return new Promise( resolve => {
      this.http.post<CreatePostResponse>(`${ URL }/api/posts/crear`, post, { headers })
        .subscribe( async resp => {
          for (const imagen of imagenesPost) {
            await this.subirFotos(imagen, resp.post.id);
          }
          resolve(true);
        });
    });
  }

  eliminarPost() {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.usuarioService.token
    });

    return new Promise( resolve => {
      this.http.delete(`${ URL }/api/posts/borrar/${this.postActual.id}`, { headers })
        .subscribe( resp => {
          this.borrarPost.emit(resp['ok']);
          resolve(true);
        });
    });
  }

  getComentarios( pull: boolean = false ) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.usuarioService.token,
      IdPost: this.postActual.id.toString()
    });

    if ( pull ) {
      this.paginaComentarios = -1;
    }

    this.paginaComentarios++;

    return this.http.get(`${ URL }/api/posts/comentarios/post?page=${this.paginaComentarios}&size=10`, { headers });
  }

  crearComentario( comentario: Comentario ) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.usuarioService.token,
      IdPost: this.postActual.id.toString()
    });

    return new Promise( resolve => {
      this.http.post(`${ URL }/api/posts/comentarios/crear`, comentario, { headers })
        .subscribe( () => {
          resolve(true);
        });
    });
  }

  borrarComentario( comentario: Comentario ) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.usuarioService.token
    });

    return new Promise( resolve => {
      this.http.delete(`${ URL }/api/posts/comentarios/borrar/${comentario.id}`, { headers })
        .subscribe( () => {
          resolve(true);
        });
    });
  }

  getFavoritos() {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.usuarioService.token
    });

    return this.http.get<RespuestaFav>(`${ URL }/api/usuarios/favoritos`, { headers });
  }

  setFavoritos() {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.usuarioService.token
    });

    return new Promise( resolve => {
      this.http.post(`${ URL }/api/usuarios/favoritos/${this.postActual.id}`, '' , { headers })
        .subscribe( resp => {
        if (resp['resultado'] === 'guardado') {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  async subirFotos( imagen: string, postId ) {
    const options: FileUploadOptions = {
      fileKey: 'file',
      headers: {
        Authorization: 'Bearer ' + this.usuarioService.token,
        IdPost: postId
      }
    };
    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    await fileTransfer.upload( imagen, `${ URL }/api/upload/fotopost`, options ).catch( err => {
        console.log('Error cargando la foto', err);
      });
  }

  cargarFotosPost(imagen, id) {
      return `${ URL }/api/posts/imagen/${ id }/${ imagen }`;
  }

  async setFiltros(filtro) {
    this.filtro = filtro;
    await this.storage.set('filtro', filtro);
  }

  async getFiltros() {
    this.filtro = await this.storage.get('filtro');
    return this.filtro;
  }

  async setOpciones(opciones) {
    this.opciones = opciones;
    await this.storage.set('opciones', opciones);
  }

  async getOpciones() {
    this.opciones = await this.storage.get('opciones');
    return this.opciones;
  }

}


