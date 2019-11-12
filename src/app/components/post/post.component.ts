import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Content, Usuario } from '../../interfaces/interfaces';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PostsService } from '../../services/posts.service';
import { ModalController, IonIcon, PopoverController } from '@ionic/angular';
import { ComentariosComponent } from '../comentarios/comentarios.component';
import { UiServiceService } from '../../services/ui-service.service';
import { OpcionesPostComponent } from '../opciones-post/opciones-post.component';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {

  @Input() post: Content = {};
  @Input() permLoc: boolean;
  @ViewChild('favorito', {static: false}) iconoFavorito: IonIcon;

  slideFotoSola = {
    allowSlideNext: false,
    allowSlidePrev: false
  };

  listaFav = [];
  listaPost;

  lat: number;
  lon: number;
  distanciaTotal: string;

  usuario: Usuario;
  mostrarUbicacion = false;

  numeroComentarios;

  fotosCompartir: any[] = [];

  constructor( private modalController: ModalController,
               private postsService: PostsService,
               private socialSharing: SocialSharing,
               private uiService: UiServiceService,
               private popoverCtrl: PopoverController,
               private usuarioService: UsuarioService) { }

  ngOnInit() {
    if ( this.post.comentarios !== null ) {
      this.numeroComentarios = this.post.comentarios.length;
    }
    this.usuario = this.usuarioService.getUsuario();
    this.getGeolocation();
    this.comprobarFavorito();
  }

  compartirOtros() {
    this.cargarFotos();
    const options = {
      message: this.post.mensaje,
      subject: 'Compartido desde la app LocalizaDog',
      files: this.fotosCompartir,
      url: 'https://www.localizadog.es',
      chooserTitle: 'Seleccione una app'
    };
    this.socialSharing.shareWithOptions(options);
    this.fotosCompartir = [];
  }

  cargarFotos() {
    if (this.post.imagenes !== null) {
      if (this.post.imagenes.length > 1) {
        for ( const imagen of this.post.imagenes ) {
          this.fotosCompartir.push(this.postsService.cargarFotosPost(imagen, this.post.id));
        }
      } else {
        this.fotosCompartir.push(this.postsService.cargarFotosPost(this.post.imagenes[0], this.post.id));
      }
    }
  }

  async mostrarComentarios() {
    this.postsService.postActual = this.post;
    const modal = await this.modalController.create({
      component: ComentariosComponent,
      animated: true
    });
    await modal.present();
    await modal.onDidDismiss().then((data) => {
      this.numeroComentarios = data['data'].comentarios.length;
    });
  }

  agregarFavorito() {
    this.postsService.postActual = this.post;
    this.postsService.setFavoritos().then( resp => {
      if ( resp === true ) {
        this.uiService.mensajeToast('Post añadido a favoritos!');
        this.post.favorito = true;
      } else {
        this.uiService.mensajeToast('Post eliminado de favoritos!');
        this.post.favorito = false;
      }
      return resp;
    });
  }

  comprobarFavorito() {
    this.postsService.getFavoritos().subscribe( resp => {
      if ( resp.posts !== undefined ) {
        this.listaFav.push( ...resp.posts );
        for (const f of Object.keys(this.listaFav)) {
          if (this.post.id === this.listaFav[f]) {
            this.post.favorito = true;
          }
        }
      } else {
        return;
      }
    });
  }

  async mostrarOpciones(event) {
    this.postsService.postActual = this.post;
    const popover = await this.popoverCtrl.create({
      component: OpcionesPostComponent,
      event,
      animated: true
    });
    popover.style.cssText = '--max-width: 120px;';
    await popover.present();
  }

  async getGeolocation() {
    this.lat = this.usuarioService.getUsuario().latitud;
    this.lon = this.usuarioService.getUsuario().longitud;

    const latPost = this.post.latitud;
    const lonPost = this.post.longitud;

    this.distanciaTotal = await this.calcularDistancia(this.lon, lonPost, this.lat, latPost) + ' km';
  }

  async calcularDistancia(lon1, lon2, lat1, lat2) {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((lon1 - lon2) * p))) / 2;
    const dis = (12742 * Math.asin(Math.sqrt(a)));
    return await Math.trunc(dis);
  }

}
