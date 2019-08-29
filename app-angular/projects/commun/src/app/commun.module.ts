import { ModalComponent } from "./components/modal/modal.component";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { SportResolver } from "./utils/sports.resolver";
import { RechercheEquipeComponent } from "./components/recherche-equipe/recherche-equipe.component";
import { ChampionnatResolver } from "./utils/championnats.resolver";
import { ClassementResolver } from "./utils/classement.resolver";
import { SignePipe } from "./utils/signe.pipe";
import { GenericMenuComponent } from "./components/generic-menu/generic-menu.component";
import { IsTypePipe } from "./utils/is-type.pipe";
import { MatchesResolver } from "./utils/matches.resolver";
import { HierarchieResolver } from "./components/coupe/hierarchie.resolver";
import { CoupeComponent } from "./components/coupe/coupe.component";
import { EquipeResolver } from "./utils/equipe.resolver";
import { LoginComponent } from "./components/login/login.component";
import { FormsModule } from "@angular/forms";
import { CartePositionnementComponent } from "./components/carte-positionnement/carte-positionnement.component";
import { EquipeDetailComponent } from "./components/equipe-detail/equipe-detail.component";
import { ModalConfirmComponent } from "./components/modal-confirm/modal-confirm.component";
import { CanDeactivateGuard } from "./utils/can-deactivate.guard";
import { FairplayComponent } from "./components/fairplay/fairplay.component";
import { SeuilsForfaitParamResolver } from "./utils/seuils-forfait.resolver";
import { SanctionBaremeResolver } from "./utils/sanction-bareme.resolver";
import { SanctionListeComponent } from "./components/sanction-liste/sanction-liste.component";
import { SanctionEquipeParamResolver } from "./utils/sanction-equipe.resolver";
import { RouterModule } from "@angular/router";
import { LoadingInterceptor } from "./utils/loading.interceptor";
import { EquipeDetailViewComponent } from "./components/equipe-detail-view/equipe-detail-view.component";
import { LoadDisableDirective } from "./utils/loaddisable.directive";

const httpInterceptorProviders = [
	{ provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
]

@NgModule({
	declarations: [
		ModalComponent,
		RechercheEquipeComponent,
		GenericMenuComponent,
		CoupeComponent,
		LoginComponent,
		CartePositionnementComponent,
		EquipeDetailComponent,
		EquipeDetailViewComponent,
		ModalConfirmComponent,
		FairplayComponent,
		IsTypePipe,
		SignePipe,
		SanctionListeComponent,
		LoadDisableDirective,
	],
	imports: [
		BrowserModule,
		NgbModule,
		HttpClientModule,
		FormsModule,
		RouterModule,
	],
	providers: [
		CanDeactivateGuard,
		SportResolver,
		ChampionnatResolver,
		ClassementResolver,
		HierarchieResolver,
		EquipeResolver,
		MatchesResolver,
		SeuilsForfaitParamResolver,
		SanctionBaremeResolver,
		SanctionEquipeParamResolver,
		httpInterceptorProviders,
	],
	entryComponents: [
		ModalComponent,
		LoginComponent,
		ModalConfirmComponent,
		CartePositionnementComponent,
		FairplayComponent,
	],
	exports: [
		ModalComponent,
		RechercheEquipeComponent,
		GenericMenuComponent,
		CoupeComponent,
		EquipeDetailComponent,
		EquipeDetailViewComponent,
		FairplayComponent,
		IsTypePipe,
		SignePipe,
		SanctionListeComponent,
		LoadDisableDirective,
	]
})
export class CommunModule { }
