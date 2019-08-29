import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { FPResultat } from "@commun/src/app/model/FPClassement";
import { FairplayService } from "@commun/src/app/services/fairplay.service";
import { Observable } from "rxjs";

@Injectable()
export class FpClassementResolver implements Resolve<FPResultat> {

	constructor(
		private fairplayService: FairplayService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FPResultat> {
		const champId = +route.paramMap.get('champId');
		return this.fairplayService.getClassement(champId);
	}
}
