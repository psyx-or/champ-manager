import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { FairplayService } from "projects/commun/src/app/services/fairplay.service";
import { FPFeuille } from "projects/commun/src/app/model/FPFeuille";

@Injectable()
export class FairplayEquipeResolver implements Resolve<FPFeuille[]> {

	constructor(
		private fairplayService: FairplayService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FPFeuille[]> {
		const type = route.paramMap.get('type');
		const equipeId = +route.paramMap.get('equipeId');

		return this.fairplayService.getFeuilles(equipeId, type);
	}
}
