import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Equipe } from '../../model/Equipe';

@Component({
  selector: 'app-carte-positionnement',
  templateUrl: './carte-positionnement.component.html',
  styleUrls: ['./carte-positionnement.component.css']
})
export class CartePositionnementComponent implements OnInit {

	@Input() equipe: Equipe;
	
	@ViewChild('gmap') gmapElement: any;

	map: google.maps.Map;
	geocoder: google.maps.Geocoder;
	marqueur: google.maps.Marker;
	adresse: string;
	position: string;

	constructor(
		public activeModal: NgbActiveModal
	) { }

	/**
	 * Initialisation du composant
	 */
	ngOnInit() {
		// Paramètres
		this.adresse = this.equipe.terrain && this.equipe.terrain.replace("\n", " ");
		this.position = this.equipe.position;

		// Création des objets Google Maps
		this.map = new google.maps.Map(this.gmapElement.nativeElement, {
			center: new google.maps.LatLng(45.183, 5.717),
			zoom: 10,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		this.geocoder = new google.maps.Geocoder();

		// Création du marqueur
		this.marqueur = new google.maps.Marker({
			map: this.map,
			draggable: true,
			position: null
		});

		google.maps.event.addListener(this.marqueur, 'dragend', () => {
			this.position = this.marqueur.getPosition().toUrlValue();
		});

		// Centrage de la carte
		if (this.position != null) {
			let pos = this.position.split(',');
			this.centre(new google.maps.LatLng(parseFloat(pos[0]), parseFloat(pos[1])));
		}
		else if (this.adresse != null && this.adresse != "") {
			this.geocode();
		}
	}

	/**
	 * Lance le géocodage
	 */
	geocode() {
		this.geocoder.geocode(
			{ address: this.adresse },
			(results, status) => {
				if (status == google.maps.GeocoderStatus.OK) {
					let position = results[0].geometry.location;
					this.position = position.toUrlValue();
					this.centre(position);
				}
				else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
					alert("Adresse non trouvée");
				}
				else {
					alert('Géocodage impossible pour cause de ' + status);
				}
			});
	}

	/**
	 * Centre la carte sur une position
	 * @param position 
	 */
	centre(position: google.maps.LatLng)
	{
		this.marqueur.setPosition(position);
		this.map.setCenter(position);
		if (this.map.getZoom()<16) this.map.setZoom(16);
	}
}
