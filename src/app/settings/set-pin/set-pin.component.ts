import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'set-pin',
  templateUrl: './set-pin.component.html',
  styleUrls: ['./set-pin.component.scss']
})
export class SetPinComponent implements OnInit {

  newPin: string | undefined;
  errorMessage: string | undefined;
  busy = false;
  aborted = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // TODO: check if user already has a pin and route away
  }

  onNewPinEnterred(pin: string) {
    this.errorMessage = undefined;
    this.newPin = pin;
  }

  async onConfirmPinEnterred(pin: string) {
    this.errorMessage = undefined;

    if (!this.newPin) {
      this.reset();
      return;
    }

    if (this.newPin === pin) {
      this.busy = true;
      this.errorMessage = undefined;

      try {
        const success = await this.authService.setPin(pin);

        if (success) {
          this.router.navigateByUrl('/');
        } else {
          this.errorMessage = 'An error occured.';
          this.aborted = true;
        }
      } catch (error) {
        this.errorMessage = error;
        this.aborted = true;
      } finally {
        this.busy = false;
      }
    } else {
      this.errorMessage = 'pin does not match.';
    }
  }

  reset() {
    this.aborted = false;
    this.newPin = undefined;
    this.errorMessage = undefined;
  }

  onCloseClick() {
    this.router.navigateByUrl('/');
  }
}
