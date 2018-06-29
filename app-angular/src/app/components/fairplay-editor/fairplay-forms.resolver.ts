import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RequeteService } from '../../services/requete.service';
import { FPForm } from '../../model/FPForm';
import { FairplayService } from '../../services/fairplay.service';

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
