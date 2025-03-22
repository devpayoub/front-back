import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { PosteComponent } from './pages/hr/poste/poste.component';
import { ContratComponent } from './pages/hr/contrat/contrat.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { TopbarComponent } from './layouts/topbar/topbar.component';
import { AppComponent } from './app.component';
import { HolidaysComponent } from './pages/hr/holidays/holidays.component';
import { LeaveEmployeeComponent } from './pages/hr/leaves/leave-employee/leave-employee.component';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from './core/helpers/auth.interceptor';


// Fonction d'initialisation de Keycloak
function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080/auth', // Remplacez par l'URL de votre serveur Keycloak
        realm: 'your-realm',                // Remplacez par le nom de votre realm
        clientId: 'your-client-id',         // Remplacez par l'ID client
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false
      }
    });
}

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    SidebarComponent,
    ContratComponent,
    PosteComponent,
    HolidaysComponent,
    LeaveEmployeeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    KeycloakAngularModule,
    CommonModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
      
    },

    { provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true }

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
