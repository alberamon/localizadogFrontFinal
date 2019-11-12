import { Component, OnInit, Input, ViewChild } from '@angular/core';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {

  @Input() latitud: number;
  @Input() longitud: number;
  @ViewChild('mapa', {static: true}) mapa;

  constructor() { }

  ngOnInit() {


    mapboxgl.accessToken = 'pk.eyJ1IjoiYWxiZXJhbW9uIiwiYSI6ImNqeThqbzFkZjBhMzUzZG8zZmtndThjenQifQ.RoL9FJo4-7Y8Tq4ckFuXKQ';
    const map = new mapboxgl.Map({
    container: this.mapa.nativeElement,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [ this.longitud, this.latitud ],
    zoom: 13
    });

    new mapboxgl.Marker()
      .setLngLat( [ this.longitud, this.latitud] )
      .addTo( map );
  }

}
