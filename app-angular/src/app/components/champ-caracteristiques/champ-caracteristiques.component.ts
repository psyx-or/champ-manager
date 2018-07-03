import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Sport } from '../../model/Sport';
import { FPForm } from '../../model/FPForm';
import { Championnat, ChampType, ChampModele } from '../../model/Championnat';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-champ-caracteristiques',
  templateUrl: './champ-caracteristiques.component.html',
  styleUrls: ['./champ-caracteristiques.component.css']
})
export class ChampCaracteristiquesComponent implements OnInit {

	@Input() championnat: Championnat | ChampModele;
	@Output() sportChange = new EventEmitter();

	sports: Sport[];
	fpForms: FPForm[];
	types: [string, string][];
	newSport: Sport = new Sport();

	constructor(
		private route: ActivatedRoute,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		// Récupération des données
		this.types = Object.entries(ChampType);
		this.route.data
			.subscribe((data: { sports: Sport[], fpForms: FPForm[] }) => {
				this.sports = data.sports;
				this.fpForms = data.fpForms;
			});
	}

	/**
	 * Sélection d'un sport dans la combo
	 * @param sport 
	 */
	public selectionSport(sport: Sport): void {
		this.sportChange.emit(sport == this.newSport ? null : this.championnat.sport);
	}

	/**
	 * Clic sur la case à cocher des matches nuls
	 * @param avecNuls 
	 */
	public majNuls(avecNuls: boolean): void {
		if (!avecNuls)
			this.championnat.ptnul = null;
		// TODO: Gestion de la valeur de la checkbox si appelé depuis l'extérieur
	}

	/**
	 * Sélection d'un type de championnat dans la combo
	 * @param type 
	 */
	public changeType(type: ChampType): void {
		if (type == ChampType.Coupe) {
			this.championnat.ptvict = null;
			this.championnat.ptnul = null;
			this.championnat.ptdef = null;
		}
	}

	/**
	 * Compare deux sports
	 * @param sport1 
	 * @param sport2 
	 */
	public compareSport(sport1: Sport, sport2: Sport) {
		if (sport1 == sport2)
			return true;
		if ((sport1 == null) != (sport2 == null))
			return false;

		return sport1.nom == sport2.nom;
	}

	/**
	 * Compare deux feuilles de fair-play
	 * @param fpForm1 
	 * @param fpForm2 
	 */
	public compareFpforms(fpForm1: FPForm, fpForm2: FPForm) {
		if (fpForm1 == fpForm2)
			return true;
		if ((fpForm1 == null) != (fpForm2 == null))
			return false;
			
		return fpForm1.id == fpForm2.id;
	}
}
