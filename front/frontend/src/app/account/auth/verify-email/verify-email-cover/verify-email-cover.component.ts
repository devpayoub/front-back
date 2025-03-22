import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthenticationService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email-cover',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './verify-email-cover.component.html',
  styles: ``
})
export class VerifyEmailCoverComponent implements OnInit {
  email: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  onSubmitVerificationCode(code: string, event: Event) {
    event.preventDefault();

    if (!this.email) {
      return;
    }

    
  }
}
