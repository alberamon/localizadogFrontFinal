import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'imageSanitizer'
})
export class ImageSanitizerPipe implements PipeTransform {

  constructor( private domSanitizer: DomSanitizer) {}

  transform( imagen: any ): any {
    return this.domSanitizer.bypassSecurityTrustUrl( imagen );
  }

}
