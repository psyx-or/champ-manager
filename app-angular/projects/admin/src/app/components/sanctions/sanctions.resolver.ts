import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { RequeteService } from "projects/commun/src/app/services/requete.service";
import { Observable } from "rxjs";
import { Sanction } from "@commun/src/app/model/Sanction";
import { SanctionService } from "@commun/src/app/services/sanction.service";

@Injectable()
export class SanctionsResolver implements Resolve<Sanction[]> {

	constructor(
		private requeteService: RequeteService,
		private sanctionService: SanctionService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Sanction[]> {
		return this.requeteService.recupere(
			this.sanctionService.get()
		);
	}
}
