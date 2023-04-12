import { Component, OnInit } from '@angular/core';
import { AppAuthService } from 'src/shared/auth/app-auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {
  submitting = false;
  show: boolean = false;

  constructor(public authService: AppAuthService) { 
  }

  ngOnInit() {
  }

  login(): void {
    this.submitting = true;
    this.authService.authenticate(() => (this.submitting = false));
  }

  password() {
    this.show = !this.show;
}

}
