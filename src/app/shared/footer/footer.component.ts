import {Component, ViewChild} from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  @ViewChild(MapInfoWindow, {static: false}) infoWindow!: MapInfoWindow;
  @ViewChild(GoogleMap, {static: false}) map!: GoogleMap;
  kindergartenTitle: any;
  zoom = 16;
  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 47.45410,
    lng: 26.299420
  };

  constructor() {}

  ngOnInit(): void {
    this.kindergartenTitle = "Grădinița Dumbrava Minunată Fălticeni";
  }

  openInfo(marker: MapMarker) {
    this.infoWindow.open(marker);
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
}
