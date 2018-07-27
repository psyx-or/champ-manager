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
import { ClassementComponent } from './components/classement/classement.component';
import { CoupeComponent } from './components/coupe/coupe.component';
import { MatchesComponent } from './components/matches/matches.component';
import { ChampImportComponent } from './components/champ-import/champ-import.component';
import { JourneesChampResolver } from './components/journees-champ/journees-champ.resolver';
import { MatchAvaliderComponent } from './components/match-avalider/match-avalider.component';
import { MatchJourneeComponent } from './components/match-journee/match-journee.component';
import { EquipesComponent } from './components/equipes/equipes.component';
import { CalendrierComponent } from './components/calendrier/calendrier.component';
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
import { EquipeDetailComponent } from './components/equipe-detail/equipe-detail.component';
import { EquipeComponent } from './components/equipe/equipe.component';
import { EquipeResolver } from './components/equipe/equipe.resolver';
import { CanDeactivateGuard } from './utils/can-deactivate.guard';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';
import { FairplayClassementComponent } from './components/fairplay-classement/fairplay-classement.component';
import { HierarchieResolver } from './components/coupe/hierarchie.resolver';
import { CalendrierDoublonsComponent } from './components/calendrier-doublons/calendrier-doublons.component';
import { FairplayEquipeComponent } from './components/fairplay-equipe/fairplay-equipe.component';
import { FairplayEquipeResolver } from './components/fairplay-equipe/fairplay-equipe.resolver';
import { CommunModule } from 'projects/commun/src/app/commun.module';


@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ChampionnatsComponent,
    ChampCreationComponent,
    LoginComponent,
    JourneesChampComponent,
    ClassementComponent,
    CoupeComponent,
    MatchesComponent,
    ChampImportComponent,
    MatchAvaliderComponent,
    MatchJourneeComponent,
    EquipesComponent,
    CalendrierComponent,
    FairplayEditorComponent,
    FairplayComponent,
    ChampCaracteristiquesComponent,
    ChampModeleComponent,
    CartePositionnementComponent,
    ParametresComponent,
    EquipeDetailComponent,
    EquipeComponent,
    ModalConfirmComponent,
    FairplayClassementComponent,
    CalendrierDoublonsComponent,
    FairplayEquipeComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
	FormsModule,
	CommunModule
  ],
  providers: [
	  JourneesChampResolver,
	  FpformsResolver,
	  FpformsResumeResolver,
	  ChampModeleResolver,
	  ParametresResolver,
	  EquipeResolver,
	  CanDeactivateGuard,
	  HierarchieResolver,
	  FairplayEquipeResolver
  ],
  bootstrap: [AppComponent],
  entryComponents: [
	  LoginComponent,
	  ChampImportComponent,
	  FairplayComponent,
	  CartePositionnementComponent,
	  ModalConfirmComponent
  ]
})																																																																																																																																																																																														
export class AppModule { }
