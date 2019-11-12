import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Content, Usuario } from '../../interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { FiltroComponent } from '../../components/filtro/filtro.component';
import { UsuarioService } from '../../services/usuario.service';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  posts: Content[] = [];

  habilitado = true;
  permLoc = false;

  lat: number;
  lon: number;

  usuario: Usuario;

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

  constructor( private postsService: PostsService,
               private modalController: ModalController,
               private usuarioService: UsuarioService,
               private geolocation: Geolocation) {}

  async ngOnInit() {
    this.usuario = await this.usuarioService.getUsuario();
    const resultGeo = await this.getGeolocation();

    /*this.opciones.comunidad = this.usuario.comunidad;
    this.opciones.provincia = this.usuario.provincia;
    this.opciones.localidad = this.usuario.localidad;*/
    await this.postsService.getFiltros().then( async resp => {
      if (resp !== null) {
        this.filtro = await resp;
      } else {
        this.filtro = {
          checkTodos: true,
          checkGeo: false
        };
        this.postsService.setFiltros(this.filtro);
      }
    });
    await this.postsService.getOpciones().then( async resp => {
      if (resp !== null) {
        this.opciones = await resp;
      } else {
        this.opciones = {
          localidad: '',
          provincia: '',
          pais: 'España',
          comunidad: '',
          distancia: 50
        };
        this.postsService.setOpciones(this.opciones);
      }
    });

    this.postsService.borrarPost.subscribe( ok => {
      if (ok) {
        this.recargar();
      }
    });

    if ( resultGeo ) {
      this.recargar();
    }
  }

  /*async ionViewDidEnter() {
    const resultGeo = await this.getGeolocation();
    if ( resultGeo ) {
      this.recargar();
    }
  }*/

  recargar( event? ) {
      this.siguientes( event, true );
      this.habilitado = true;
      this.posts = [];
  }

  async siguientes( event?, pull: boolean = false ) {
    if (this.permLoc && this.filtro.checkGeo === true) {
      await this.getPostsGeo(event, pull);
    } else {
      await this.getPosts(event, pull);
      this.filtro = {
        checkTodos: true,
        checkGeo: false
      };
      this.postsService.setFiltros(this.filtro);
    }
    /*if (this.filtro.checkTodos === true && this.filtro.checkComunidad === false &&
      this.filtro.checkProvincia === false && this.filtro.checkLocalidad === false && this.filtro.checkGeo === false) {
        this.getPosts(event, pull);
    }

    if (this.filtro.checkTodos === false && this.filtro.checkComunidad === true &&
      this.filtro.checkProvincia === false && this.filtro.checkLocalidad === false && this.filtro.checkGeo === false) {
        this.getPostsComunidad(event, pull);
    }

    if (this.filtro.checkTodos === false && this.filtro.checkComunidad === false &&
      this.filtro.checkProvincia === true && this.filtro.checkLocalidad === false && this.filtro.checkGeo === false) {
        this.getPostsProvincia(event, pull);
    }

    if (this.filtro.checkTodos === false && this.filtro.checkComunidad === false &&
      this.filtro.checkProvincia === false && this.filtro.checkLocalidad === true && this.filtro.checkGeo === false) {
        this.getPostsLocalidad(event, pull);
    }

    if (this.filtro.checkTodos === false && this.filtro.checkComunidad === false &&
      this.filtro.checkProvincia === false && this.filtro.checkLocalidad === false && this.filtro.checkGeo === true) {
        this.getPostsGeo(event, pull);
    }*/
  }

  async getPosts(event?, pull?) {
    this.postsService.getPosts( pull )
    .subscribe( resp => {
      this.posts.push( ...resp.posts.content );
      if ( event ) {
        event.target.complete();

        if ( resp.posts.content.length === 0) {
          this.habilitado = false;
        }
      }
    });
  }

  async getPostsGeo(event?, pull?) {
    const coords = await this.usuarioService.getUsuario().latitud + ',' + this.usuarioService.getUsuario().longitud;
    this.postsService.getPostsCoordenadas( pull, coords ).subscribe( resp => {
      if ( resp.posts === undefined ) {
        this.getPosts(event, pull);
        return;
      }
      this.posts.push( ...resp.posts.content );
      if ( event ) {
        event.target.complete();

        if ( resp.posts.content.length === 0) {
          this.habilitado = false;
        }
      }
    });
  }

  /*getPostsComunidad(event?, pull: boolean = false) {
    this.postsService.getPostsComunidad( pull )
    .subscribe( resp => {
      if (resp.ok === false) {
        this.uiService.mensajeAlerta('No existen post en la comunidad autónoma seleccionada, por lo tanto se le muestran todos los posts existentes.');
        this.filtro = {
          checkTodos: true,
          checkComunidad: false,
          checkProvincia: false,
          checkLocalidad: false
        };
        this.getPosts(event, pull);
        return;
      }
      this.posts.push( ...resp.posts.content );
      if ( event ) {
        event.target.complete();

        if ( resp.posts.content.length === 0) {
          this.habilitado = false;
        }
      }
    });
  }

  getPostsProvincia(event?, pull: boolean = false) {
    this.postsService.getPostsProvincia( pull )
    .subscribe( resp => {
      if (resp.ok === false) {
        this.uiService.mensajeAlerta('No existen post en la provincia seleccionada, pruebe con otro filtro menos restrictivo. Procedemos a mostrarte todos los post existentes.');
        this.filtro = {
          checkTodos: true,
          checkComunidad: false,
          checkProvincia: false,
          checkLocalidad: false
        };
        this.getPosts(event, pull);
        return;
      }
      this.posts.push( ...resp.posts.content );
      if ( event ) {
        event.target.complete();

        if ( resp.posts.content.length === 0) {
          this.habilitado = false;
        }
      }
    });
  }

  getPostsLocalidad(event?, pull: boolean = false) {
    this.postsService.getPostsLocalidad( pull )
    .subscribe( resp => {
      if (resp.ok === false) {
        this.uiService.mensajeAlerta('No existen post en la localidad seleccionada, pruebe con otro filtro menos restrictivo. Procedemos a mostrarte todos los post existentes.');
        this.filtro = {
          checkTodos: true,
          checkComunidad: false,
          checkProvincia: false,
          checkLocalidad: false
        };
        this.getPosts(event, pull);
        return;
      }
      this.posts.push( ...resp.posts.content );
      if ( event ) {
        event.target.complete();

        if ( resp.posts.content.length === 0) {
          this.habilitado = false;
        }
      }
    });
  }*/

  async mostrarFiltros() {
    const modal = await this.modalController.create({
      component: FiltroComponent,
      animated: true
    });
    await modal.present();
    await modal.onDidDismiss().then(async (data) => {
      await this.postsService.setFiltros(data.data.filtro);
      await this.postsService.setOpciones(data.data.opciones);
      this.filtro = data.data.filtro;
      this.recargar();
    });
  }

  async getGeolocation() {
    return new Promise( resolve => {
      this.geolocation.getCurrentPosition().then(( geoposition: Geoposition ) => {
        this.lat = geoposition.coords.latitude;
        this.lon = geoposition.coords.longitude;
        this.permLoc = true;
        this.usuarioService.setCoordsUser(this.lat, this.lon);
        resolve(true);
      }).catch(() => {
        this.permLoc = false;
        resolve(false);
      });
    });
  }
}
