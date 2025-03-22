import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, icons } from 'lucide-angular';
import { AuthenticationService } from '../../../../core/services/auth.service';
import { login } from '../../../../store/Authentication/authentication.actions';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../../../../store/Authentication/auth.models';

@Component({
  selector: 'app-login-cover',
  standalone: true,
  imports: [RouterModule,LucideAngularModule],
  templateUrl: './login-cover.component.html',
  styles: ``,
  providers:[{provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons)}]
})
export class LoginCoverComponent {
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType = false;
  error = '';
  year: number = new Date().getFullYear();
  private apiUrl = 'http://localhost:8081/users'; // Remplacez par l'URL de votre backend
  private tokenKey = 'authToken'; // Clé pour stocker le token dans localStorage

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Redirige vers la page d'accueil si l'utilisateur est déjà connecté
    if (this.currentUser()) {
      this.router.navigate(['/']);
    }

    // Initialise le formulaire de connexion
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Accesseur pour les contrôles du formulaire
  get f() { return this.loginForm.controls; }

  // Soumet le formulaire
  onSubmit() {
    this.submitted = true;

    // Si le formulaire est invalide, retourne
    if (this.loginForm.invalid) {
      return;
    }

    // Récupère les valeurs du formulaire
    const email = this.f['email'].value;
    const password = this.f['password'].value;

    // Appel API pour la connexion
    this.http.post<any>(`${this.apiUrl}/login`, { email, password }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    })
    .subscribe({
      next: (response) => {
        console.log('Réponse de l\'API:', response);
        if (response && response.token) {
          // Stocke le token dans localStorage
          localStorage.setItem(this.tokenKey, response.token);
          // Redirige vers la page d'accueil
          this.router.navigate(['/']);
        } else {
          this.error = 'Échec de la connexion. Vérifiez vos identifiants et réessayez.';
        }
      },
      error: (err) => {
        console.error('Erreur lors de la connexion:', err);
        this.error = 'Une erreur s\'est produite lors de la connexion.';
      }
    });
  }

  // Fonction pour vérifier l'utilisateur connecté
  private currentUser(): User | null {
    const token = localStorage.getItem(this.tokenKey);
    return token ? { token } as User : null;
  }

  // Fonction pour afficher/masquer le mot de passe
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
// import { Component, OnInit } from '@angular/core';
// import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { User } from '../../../../store/Authentication/auth.models';


// @Component({
//   selector: 'app-login-cover',
//   templateUrl: './login-cover.component.html',
//   styles: []
// })
// export class LoginCoverComponent implements OnInit {
//   loginForm!: UntypedFormGroup;
//   submitted = false;
//   fieldTextType = false;
//   error = '';
//   year: number = new Date().getFullYear();
//   private apiUrl = 'http://localhost:8081/users'; // Remplacez par l'URL de votre backend
//   private tokenKey = 'authToken'; // Clé pour stocker le token dans localStorage

//   constructor(
//     private formBuilder: UntypedFormBuilder,
//     private router: Router,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     // Redirige vers la page d'accueil si l'utilisateur est déjà connecté
//     if (this.currentUser()) {
//       this.router.navigate(['/']);
//     }

//     // Initialise le formulaire de connexion
//     this.loginForm = this.formBuilder.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required]]
//     });
//   }

//   // Accesseur pour les contrôles du formulaire
//   get f() { return this.loginForm.controls; }

//   // Soumet le formulaire
//   onSubmit() {
//     this.submitted = true;

//     // Si le formulaire est invalide, retourne
//     if (this.loginForm.invalid) {
//       return;
//     }

//     // Récupère les valeurs du formulaire
//     const email = this.f['email'].value;
//     const password = this.f['password'].value;

//     // Appel API pour la connexion
//     this.http.post<any>(`${this.apiUrl}/login`, { email, password })
//       .subscribe({
//         next: (response) => {
//           if (response && response.token) {
//             // Stocke le token dans localStorage
//             localStorage.setItem(this.tokenKey, response.token);
//             // Redirige vers la page d'accueil
//             this.router.navigate(['/']);
//           } else {
//             this.error = 'Échec de la connexion. Vérifiez vos identifiants et réessayez.';
//           }
//         },
//         error: (err) => {
//           this.error = 'Une erreur s\'est produite lors de la connexion.';
//         }
//       });
//   }

//   // Fonction pour vérifier l'utilisateur connecté
//   private currentUser(): User | null {
//     const token = localStorage.getItem(this.tokenKey);
//     return token ? { token } as User : null;
//   }

//   // Fonction pour afficher/masquer le mot de passe
//   toggleFieldTextType() {
//     this.fieldTextType = !this.fieldTextType;
//   }
// }