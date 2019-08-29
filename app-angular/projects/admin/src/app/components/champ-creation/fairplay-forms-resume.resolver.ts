import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FPForm } from 'projects/commun/src/app/model/FPForm';
import { FairplayService } from 'projects/commun/src/app/services/fairplay.service';

@Injectable()
export class FpformsResumeResolver implements Resolve<FPForm[]> {

	constructor(
		private fairplayService: FairplayService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FPForm[]> {
		return this.fairplayService.liste(false);
	}
}
