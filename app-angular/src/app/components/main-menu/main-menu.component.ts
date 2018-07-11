import { Component, OnInit } from '@angular/core';
import { Observable, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { RequeteService } from '../../services/requete.service';
import { EquipeService } from '../../services/equipe.service';
import { Equipe } from '../../model/Equipe';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {

	searching: boolean = false;

	constructor(
		private requeteService: RequeteService,
		private equipeService: EquipeService,
		private router: Router
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
		this.router.navigate(['equipe', $event.item.id])
	}
}
