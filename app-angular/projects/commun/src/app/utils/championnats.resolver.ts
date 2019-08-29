import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Championnat } from '../model/Championnat';
import { Observable } from 'rxjs';
import { ChampionnatService } from '../services/championnat.service';

@Injectable()
export class ChampionnatResolver implements Resolve<Championnat[]> {

	constructor(
		private championnatService: ChampionnatService
	) { }
	
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Championnat[]> {
		return this.championnatService.getChampionnatsCourants();
	}
}
