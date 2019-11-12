import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { ModalController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/interfaces';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss'],
})
export class ComentariosComponent implements OnInit {

  @Input() comentarios: any[] = [];
  @ViewChild('listaComentarios', {static: false}) listaComentarios;

  post;

  usuario: Usuario;

  usuarioCorrecto = false;

  comentario = {
    mensaje: ''
  };

  habilitado = true;
  mensajePublicar = false;

  constructor( private postsService: PostsService,
               private modalController: ModalController,
               private usuarioService: UsuarioService,
               private uiService: UiServiceService) {}

  ngOnInit() {
    this.post = this.postsService.postActual;
    this.usuario = this.usuarioService.getUsuario();
    this.recargar();
  }

  /*ionViewWillEnter() {
    this.recargar();
  }*/

  recargar( event? ) {
      this.siguientes( event, true );
      this.habilitado = true;
      this.comentarios = [];
      this.post = this.postsService.postActual;
  }

  siguientes( event?, pull: boolean = false ) {
    this.postsService.getComentarios( pull )
    .subscribe( resp => {
      if (resp['ok'] === false) {
        this.habilitado = false;
      } else {
          this.comentarios.push( ...resp['comentarios'].content );
          if ( event ) {
           event.target.complete();
          }
        }
    });
  }

  async crearComentario() {
    await this.postsService.crearComentario(this.comentario);
    await this.postsService.getPostId().subscribe( resp => {
      this.post = resp;
    });
    this.comentario.mensaje = '';
    this.recargar();
  }

  async borrarComentario(comentario) {
    const confirmar = await this.uiService.mensajeAlertaConfirmacion('¿Está seguro de que desea eliminar el comentario?');
    if ( confirmar ) {
      await this.postsService.borrarComentario(comentario);
      this.uiService.mensajeToast('Comentario eliminado correctamente');
      this.recargar();
    } else {
      this.listaComentarios.closeSlidingItems();
    }
  }

  dismiss() {
    this.modalController.dismiss(this.post);
  }

  comprobarUsuario(comentario) {
    if (comentario.usuario.id === this.usuario.id) {
      this.usuarioCorrecto = true;
    } else {
      this.usuarioCorrecto = false;
    }
  }

}
