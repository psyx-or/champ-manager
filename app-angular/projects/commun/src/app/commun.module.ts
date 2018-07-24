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

@NgModule({
	declarations: [
		ModalComponent,
		RechercheEquipeComponent,
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
		SignePipe,
	]
})
export class CommunModule { }
