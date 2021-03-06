import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {User} from '../../dtos/user';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // Error flag
  error: boolean = false;
  errorMessage: string = '';
  registerForm: FormGroup;
  // After first submission attempt, form validation will start
  submitted: boolean = false;


  constructor(private userService: UserService, private formBuilder: FormBuilder, private authService: AuthService,
              private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
     this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('.*[0-9].*')]],
      passwordConfirm: ['', Validators.required]}
      , {
      validator: this.checkPasswordMatch('password', 'passwordConfirm')
      });
  }

  /**
   * Sends user registration request
   */
  registerUser() {
    this.submitted = true;
    if (this.registerForm.valid && (this.registerForm.controls.username.value !== 'user') &&
      (this.registerForm.controls.password.value === this.registerForm.controls.passwordConfirm.value)) {
      const user: User = new User(
        null,
        this.registerForm.controls.username.value,
        this.registerForm.controls.password.value,
        this.registerForm.controls.email.value,
        0
      );
      this.createUser(user);
      // this.clearUserForm();
    } else {
      if (this.registerForm.controls.username.value === 'user') {
        this.openSnackbar('user is a reserved username!', 'warning-snackbar');
      }
      console.log('Invalid input');
    }
  }

  /**
   * Sends user creation request
   * @param user the user which should be created
   */
  createUser(user: User) {
    this.userService.createUser(user).subscribe(
      () => {
        this.openSnackbar('Registration successful!', 'success-snackbar');
        this.navigateToLogin();
      },
      error => {
        this.defaultErrorHandling(error);
      }
    );
  }

  navigateToLogin() {
    this.registerForm.reset();
    this.router.navigate(['/login']).then(
      () => {
        //
      });
  }

  private defaultErrorHandling(error: any) {
    console.log(error);
    this.error = true;
    this.errorMessage = '';
    this.errorMessage = error.error.message;

    if (error.status == 400) {
      this.openSnackbar('Username or email already taken!', 'warning-snackbar');
      this.vanishError();
    }
  }

  // private clearUserForm() {
  //   this.registerForm.reset();
  //   this.submitted = false;
  // }

  openSnackbar(message: string, type: string) {
    this.snackBar.open(message, 'close', {
      duration: 8000,
      panelClass: [type]
    });
  }

  /**
   * Error flag will be deactivated, which clears the error message
   */
  vanishError() {
    this.error = false;
  }

  get f() {
    return this.registerForm.controls;
  }

  checkPasswordMatch(password: string, confirmation: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[password];
      const matchingControl = formGroup.controls[confirmation];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordsDifferent: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
