import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { SanctionService } from "../services/sanction.service";
import { Observable } from "rxjs";
import { Sanction } from "../model/Sanction";

@Injectable()
export class SanctionEquipeParamResolver implements Resolve<Sanction[]> {

	constructor(
		private sanctionService: SanctionService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Sanction[]> {
		const equipeId = +route.paramMap.get('equipeId');

		return this.sanctionService.getEquipe(equipeId);
	}
}
