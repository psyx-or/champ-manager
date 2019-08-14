import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { RequeteService } from "../services/requete.service";
import { SanctionService } from "../services/sanction.service";
import { Observable } from "rxjs";
import { Sanction } from "../model/Sanction";

@Injectable()
export class SanctionEquipeParamResolver implements Resolve<Sanction[]> {

	constructor(
		private requeteService: RequeteService,
		private sanctionService: SanctionService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Sanction[]> {
		const equipeId = +route.paramMap.get('equipeId');

		return this.requeteService.recupere(
			this.sanctionService.getEquipe(equipeId)
		);
	}
}
