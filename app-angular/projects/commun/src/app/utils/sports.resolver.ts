import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RequeteService } from '../services/requete.service';
import { Sport } from '../model/Sport';
import { SportService } from '../../../../commun/src/app/services/sport.service';

@Injectable()
export class SportResolver implements Resolve<Sport[]> {

	constructor(
		private requeteService: RequeteService,
		private sportsService: SportService
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Sport[]> {
		return this.requeteService.recupere(
			this.sportsService.getSports()
		);
	}
}
