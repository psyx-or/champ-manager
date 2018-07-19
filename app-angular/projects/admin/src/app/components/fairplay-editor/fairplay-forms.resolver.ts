import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { FairplayService } from '../../services/fairplay.service';
import { FPForm } from 'projects/commun/src/app/model/FPForm';

@Injectable()
export class FpformsResolver implements Resolve<FPForm[]> {

	constructor(
		private requeteService: RequeteService,
		private fairplayService: FairplayService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FPForm[]> {
		return this.requeteService.recupere(
			this.fairplayService.liste(true)
		);
	}
}
