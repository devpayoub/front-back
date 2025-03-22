import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, icons } from 'lucide-angular';
import { Register } from '../../store/Authentication/authentication.actions';
import { AuthenticationService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterModule,
    LucideAngularModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styles: ``,
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
})
export class RegisterComponent {
  signupForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    // Initialize form controls
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['user', [Validators.required]]
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    this.submitted = true;
  
    if (this.signupForm.invalid) {
      return; // Do nothing if form is invalid
    }
  
    this.loading = true;
  
    const { email, username, password, role } = this.signupForm.value;
    
    // Ensure role is always an array
    const roleArray = Array.isArray(role) ? role : [role];  // Ensure role is an array
  
    this.authService.register(email, username, password, roleArray).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.loading = false;
        this.router.navigate(['/account-login']);
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.loading = false;
      },
    });
  }
}  