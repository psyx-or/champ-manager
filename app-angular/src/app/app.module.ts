import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ChampionnatsComponent } from './components/championnats/championnats.component';
import { HttpClientModule } from '@angular/common/http';
import { ChampCreationComponent } from './components/champ-creation/champ-creation.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { JourneesChampComponent } from './components/journees-champ/journees-champ.component';
import { ModalComponent } from './components/modal/modal.component';
import { ClassementComponent } from './components/classement/classement.component';
import { CoupeComponent } from './components/coupe/coupe.component';
import { MatchesComponent } from './components/matches/matches.component';
import { GenericMenuComponent } from './components/generic-menu/generic-menu.component';
import { SignePipe } from './utils/signe.pipe';
import { ChampImportComponent } from './components/champ-import/champ-import.component';
import { ChampionnatResolver } from './components/championnats/championnats.resolver';
import { SportResolver } from './utils/sports.resolver';
import { JourneesChampResolver } from './components/journees-champ/journees-champ.resolver';
import { ClassementResolver } from './components/classement/classement.resolver';
import { MatchAvaliderComponent } from './components/match-avalider/match-avalider.component';
import { MatchJourneeComponent } from './components/match-journee/match-journee.component';
import { EquipesComponent } from './components/equipes/equipes.component';
import { CalendrierComponent } from './components/calendrier/calendrier.component';
import { IsTypePipe } from './utils/is-type.pipe';
import { FairplayEditorComponent } from './components/fairplay-editor/fairplay-editor.component';
import { FpformsResolver } from './components/fairplay-editor/fairplay-forms.resolver';
import { FpformsResumeResolver } from './components/champ-creation/fairplay-forms-resume.resolver';
import { FairplayComponent } from './components/fairplay/fairplay.component';
import { ChampCaracteristiquesComponent } from './components/champ-caracteristiques/champ-caracteristiques.component';
import { ChampModeleComponent } from './components/champ-modele/champ-modele.component';
import { ChampModeleResolver } from './utils/champ-modele.resolver';
import { CartePositionnementComponent } from './components/carte-positionnement/carte-positionnement.component';
import { ParametresComponent } from './components/parametres/parametres.component';
import { ParametresResolver } from './components/parametres/parametres.resolver';


@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ChampionnatsComponent,
    ChampCreationComponent,
    LoginComponent,
    ModalComponent,
    JourneesChampComponent,
    ClassementComponent,
    CoupeComponent,
    MatchesComponent,
    GenericMenuComponent,
    SignePipe,
    ChampImportComponent,
    MatchAvaliderComponent,
    MatchJourneeComponent,
    EquipesComponent,
    CalendrierComponent,
    IsTypePipe,
    FairplayEditorComponent,
    FairplayComponent,
    ChampCaracteristiquesComponent,
    ChampModeleComponent,
    CartePositionnementComponent,
    ParametresComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
	  ChampionnatResolver, 
	  SportResolver, 
	  JourneesChampResolver,
	  ClassementResolver,
	  FpformsResolver,
	  FpformsResumeResolver,
	  ChampModeleResolver,
	  ParametresResolver
  ],
  bootstrap: [AppComponent],
  entryComponents: [
	  LoginComponent,
	  ModalComponent,
	  ChampImportComponent,
	  FairplayComponent,
	  CartePositionnementComponent
  ]
})
export class AppModule { }
