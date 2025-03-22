import { Component } from '@angular/core';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, icons } from 'lucide-angular';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { login } from '../../store/Authentication/authentication.actions';
import { AuthenticationService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LucideAngularModule, FormsModule, ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './login.component.html',
  styles: ``,
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]

})

export class LoginComponent {
  loginForm: FormGroup;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.loginForm.controls; }


  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          this.successMessage = 'You have successfully signed in.';
          this.errorMessage = '';

          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/']); 
          }, 2000);
        },
        error: () => {
          this.errorMessage = 'Invalid login credentials!';
          this.successMessage = '';

          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        },
      });
    }
  }
}
