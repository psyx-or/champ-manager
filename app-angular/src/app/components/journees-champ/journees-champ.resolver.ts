import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Championnat } from '../../model/Championnat';
import { Observable } from 'rxjs';
import { RequeteService } from '../../services/requete.service';
import { JourneeService } from '../../services/journee.service';

@Injectable()
export class JourneesChampResolver implements Resolve<Championnat> {

	constructor(
		private requeteService: RequeteService,
		private journeeService: JourneeService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Championnat> {
		const champId = +route.paramMap.get('champId');

		return this.requeteService.recupere(
			this.journeeService.getJournees(champId)
		);
	}
}
