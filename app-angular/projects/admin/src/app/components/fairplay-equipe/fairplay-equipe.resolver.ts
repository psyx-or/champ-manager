import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { RequeteService } from "../../services/requete.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { FPFeuille } from "../../model/FPFeuille";
import { FairplayService } from "../../services/fairplay.service";

@Injectable()
export class FairplayEquipeResolver implements Resolve<FPFeuille[]> {

	constructor(
		private requeteService: RequeteService,
		private fairplayService: FairplayService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FPFeuille[]> {
		const type = route.paramMap.get('type');
		const equipeId = +route.paramMap.get('equipeId');

		return this.requeteService.recupere(
			this.fairplayService.getFeuilles(equipeId, type)
		);
	}
}
