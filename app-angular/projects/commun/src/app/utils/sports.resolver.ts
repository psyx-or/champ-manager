import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Sport } from '../model/Sport';
import { SportService } from '../../../../commun/src/app/services/sport.service';

@Injectable()
export class SportResolver implements Resolve<Sport[]> {

	constructor(
		private sportsService: SportService
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Sport[]> {
		return this.sportsService.getSports();
	}
}
