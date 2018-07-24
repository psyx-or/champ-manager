import { Component, OnInit, Input } from '@angular/core';
import { Championnat } from 'projects/commun/src/app/model/Championnat';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { ChampionnatService } from 'projects/commun/src/app/services/championnat.service';
import { sort } from 'projects/commun/src/app/utils/utils';

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
		public requeteService: RequeteService,
		private championnatService: ChampionnatService
	) { }

	ngOnInit() {
		this.requeteService.requete(
			this.championnatService.listeSimilaires(this.championnat),
			champs => this.championnats = sort(champs, 'nom')
		)
	}

	submit() {
		this.requeteService.requete(
			this.championnatService.importe(this.championnat, this.selChamps),
			rep => { alert(rep + " matches importés"); this.activeModal.close(); }
		)
	}
}
