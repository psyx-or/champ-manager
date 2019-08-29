import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { JourneeService } from '../../services/journee.service';
import { Championnat } from 'projects/commun/src/app/model/Championnat';

@Injectable()
export class JourneesChampResolver implements Resolve<Championnat> {

	constructor(
		private journeeService: JourneeService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Championnat> {
		const champId = +route.paramMap.get('champId');

		return this.journeeService.getJournees(champId);
	}
}
