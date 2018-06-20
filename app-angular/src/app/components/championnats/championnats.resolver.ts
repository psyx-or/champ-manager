import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Championnat } from '../../model/Championnat';
import { ChampionnatService } from '../../services/championnat.service';
import { Observable } from 'rxjs';
import { RequeteService } from '../../services/requete.service';

@Injectable()
export class ChampionnatResolver implements Resolve<Championnat[]> {

	constructor(
		private requeteService: RequeteService,
		private championnatService: ChampionnatService
	) { }
	
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Championnat[]> {
		return this.requeteService.recupere(
			this.championnatService.getChampionnats()
		);
	}
}
