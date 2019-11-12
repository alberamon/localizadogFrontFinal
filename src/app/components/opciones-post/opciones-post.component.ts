import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { UiServiceService } from '../../services/ui-service.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-opciones-post',
  templateUrl: './opciones-post.component.html',
  styleUrls: ['./opciones-post.component.scss'],
})
export class OpcionesPostComponent implements OnInit {

  constructor( private postService: PostsService,
               private uiService: UiServiceService,
               private popoverCtrl: PopoverController ) { }

  ngOnInit() {}

  async eliminarPost() {
    const confirmar = await this.uiService.mensajeAlertaConfirmacion('¿Está seguro de que desea eliminar el post?');
    if ( confirmar ) {
      await this.postService.eliminarPost();
      this.uiService.mensajeToast('Post eliminado correctamente');
      this.popoverCtrl.dismiss();
    }
  }

}
