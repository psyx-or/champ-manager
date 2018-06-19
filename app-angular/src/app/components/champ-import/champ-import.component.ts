import { Component, OnInit, Input } from '@angular/core';
import { Championnat } from '../../model/Championnat';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequeteService } from '../../services/requete.service';
import { ChampionnatService } from '../../services/championnat.service';
import { sort } from '../../utils/utils';

@Component({
  selector: 'app-champ-import',
  templateUrl: './champ-import.component.html',
  styleUrls: ['./champ-import.component.css']
})
export class ChampImportComponent implements OnInit {

	@Input() championnat: Championnat;

	championnats: Championnat[];
	selChamps: Championnat[];

	constructor(
		public activeModal: NgbActiveModal,
		private requeteService: RequeteService,
		private championnatService: ChampionnatService
	) { }

	ngOnInit() {
		this.requeteService.requete(
			this.championnatService.listeSimilaires(this.championnat),
			champs => this.championnats = sort(champs, 'nom')
		)
	}

	submit() {
		// TODO: import
		alert(this.selChamps.length);
	}
}
