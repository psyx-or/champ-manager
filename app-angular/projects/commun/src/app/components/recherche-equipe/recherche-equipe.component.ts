import { Component, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Equipe } from '../../model/Equipe';
import { EquipeService } from '../../services/equipe.service';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-recherche-equipe',
  templateUrl: './recherche-equipe.component.html',
  styleUrls: ['./recherche-equipe.component.css']
})
export class RechercheEquipeComponent {

	@Output() select = new EventEmitter<Equipe>();

	searching: boolean = false;

	constructor(
		private equipeService: EquipeService,
	) { }

	/**
	 * Recherche d'une équipe
	 */
	chercheEquipe = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			tap(() => this.searching = true),
			switchMap(term =>
				this.equipeService.recherche(term)
			),
			tap(() => this.searching = false)
		)

	/**
	 * Convertisseur d'affichage pour l'autocomplétion sur les équipes
	 */
	equipeResultFormatter = (equipe: Equipe) => `${equipe.nom} (${equipe.sport.nom})`;

	/**
	 * Sélection d'une équipe dans la zone de recherche
	 * @param $event 
	 */
	selectEquipe($event: NgbTypeaheadSelectItemEvent): void {
		$event.preventDefault();
		this.select.emit($event.item);
	}
}
