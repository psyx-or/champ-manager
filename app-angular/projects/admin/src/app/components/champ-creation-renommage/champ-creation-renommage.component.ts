import { Component, OnInit, Input } from '@angular/core';
import { Equipe } from '@commun/src/app/model/Equipe';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Un remplacement
 */
interface Remplacement {
	new: Equipe;
	old: Equipe;
	ex: boolean;
};

@Component({
  selector: 'app-champ-creation-renommage',
  templateUrl: './champ-creation-renommage.component.html',
  styleUrls: ['./champ-creation-renommage.component.css']
})
export class ChampCreationRenommageComponent implements OnInit {

	@Input() equipes: Equipe[];
	@Input() newEquipes: Equipe[];

	renommages: Remplacement[];
	newEquipe : Equipe = { id: null, nom: "-- Nouvelle équipe --"};

	constructor(
		public activeModal: NgbActiveModal,
	) { }

	/**
	 * Initialisation du composant
	 */
	ngOnInit() {
		this.renommages = this.newEquipes.map(this.findMatch.bind(this));
		this.equipes = [this.newEquipe, ...this.equipes];
	}

	/**
	 * Si une équipe contient le mot-clef "EX", on recherche l'ancien nom dans la liste des équipes
	 * @param e 
	 */
	findMatch(e: Equipe): Remplacement {
		// Recherche du mot-clef "EX" dans le nouveau nom
		const match = e.nom.matchAll(/\bex\b(.*)/ig).next();
		if (match.done) return { new: e, old: this.newEquipe, ex: false};

		// On l'a trouvé => on recherche l'ancienne équipe
		const expr = match.value[1].replace(/\W/g, "").toUpperCase();
		return {
			new: e,
			old: expr.length > 0 && this.equipes.find(e => e.nom.replace(/\W/g, "").toUpperCase().includes(expr)),
			ex: true
		};
	}

	/**
	 * Fin de la saisie
	 */
	submit() {
		this.renommages.forEach(r => {
			if (r.new)
				r.new.id = r.old.id
		});
		this.activeModal.close();
	}
}
