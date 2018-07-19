import { ModalComponent } from "./components/modal/modal.component";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { SportResolver } from "./utils/sports.resolver";
import { RechercheEquipeComponent } from "./components/recherche-equipe/recherche-equipe.component";

@NgModule({
	declarations: [
		ModalComponent,
		RechercheEquipeComponent,
	],
	imports: [
		BrowserModule,
		NgbModule.forRoot(),
		HttpClientModule,
	],
	providers: [
		SportResolver,
	],
	entryComponents: [
		ModalComponent,
	],
	exports: [
		ModalComponent,
		RechercheEquipeComponent,
	]
})
export class CommunModule { }
