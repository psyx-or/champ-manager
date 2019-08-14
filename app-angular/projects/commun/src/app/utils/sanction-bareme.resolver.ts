import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { SanctionCategorie } from "../model/Sanction";
import { RequeteService } from "../services/requete.service";
import { SanctionService } from "../services/sanction.service";
import { Observable } from "rxjs";

@Injectable()
export class SanctionBaremeResolver implements Resolve<SanctionCategorie[]> {

	constructor(
		private requeteService: RequeteService,
		private sanctionService: SanctionService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SanctionCategorie[]> {
		return this.requeteService.recupere(
				this.sanctionService.getBareme()
		);
	}
}
