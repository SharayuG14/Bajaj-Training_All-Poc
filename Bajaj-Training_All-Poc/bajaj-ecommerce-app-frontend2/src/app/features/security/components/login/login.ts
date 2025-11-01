import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { AuthRequest } from "../../models/auth-request";
import { AuthResponse } from "../../models/auth-response";

import { SecurityApi } from "../../services/security-api";

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  ngOnInit(): void {
    this._returnUrl = this._activatedRoute.snapshot.queryParams['returnurl'];
    console.log(this._returnUrl)
  }
  private _securityApi = inject(SecurityApi);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  protected user: AuthRequest = new AuthRequest();
  protected authResponse: AuthResponse;
  protected authErrorMessage: string = "";
  private _returnUrl: string;




  protected onCredentialSubmit(): void {
    this._securityApi.authenticateCredentials(this.user).subscribe({
      next: response => {
        if (response.token) {
          if (this._returnUrl) {
            this._router.navigate([this._returnUrl]);
          } else {
            this._router.navigate(['/home']);
          }

        } else {
          this.authErrorMessage = response.message;
          setTimeout(() => {
            this.authErrorMessage = '';
          }, 5000);
        }
      }
    })
  }
}
