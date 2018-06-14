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

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ChampionnatsComponent,
    ChampCreationComponent,
    LoginComponent,
    ModalComponent,
    JourneesChampComponent,
    ClassementComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
	  LoginComponent,
	  ModalComponent
  ]
})
export class AppModule { }
