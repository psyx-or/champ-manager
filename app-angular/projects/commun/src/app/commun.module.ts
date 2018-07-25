import { ModalComponent } from "./components/modal/modal.component";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { SportResolver } from "./utils/sports.resolver";
import { RechercheEquipeComponent } from "./components/recherche-equipe/recherche-equipe.component";
import { ChampionnatResolver } from "./utils/championnats.resolver";
import { ClassementResolver } from "./utils/classement.resolver";
import { SignePipe } from "./utils/signe.pipe";
import { GenericMenuComponent } from "./components/generic-menu/generic-menu.component";
import { IsTypePipe } from "./utils/is-type.pipe";

@NgModule({
	declarations: [
		ModalComponent,
		RechercheEquipeComponent,
		GenericMenuComponent,
		IsTypePipe,
		SignePipe
	],
	imports: [
		BrowserModule,
		NgbModule.forRoot(),
		HttpClientModule,
	],
	providers: [
		SportResolver,
		ChampionnatResolver,
		ClassementResolver
	],
	entryComponents: [
		ModalComponent,
	],
	exports: [
		ModalComponent,
		RechercheEquipeComponent,
		GenericMenuComponent,
		IsTypePipe,
		SignePipe,
	]
})
export class CommunModule { }
