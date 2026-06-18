import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../auth/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(Auth)
  private destroyRef = inject(DestroyRef)

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  })

  errorMessage = signal<string>('')
  loading = signal<boolean>(false)

  onSubmit() {
    if(this.form.invalid){
      return
    }
    
    this.loading.set(true)
    const subscription = this.authService.login(this.form.value.email!, this.form.value.password!).subscribe({
      next: (resp) => {
        const user = {
            id: resp.admin.id,           
            email: resp.admin.email,
            role: resp.admin.roles[0].role,
            display_name: resp.admin.roles[0].display_name,
            token: resp.token
        }
        this.authService.saveUser(user)
        this.loading.set(false)
      },
      error: (e) => {
        this.errorMessage.set(e.error.message) 
        setTimeout(() => {
          this.errorMessage.set('')
        }, 3000)
        this.loading.set(false)
      }
    })

    this.destroyRef.onDestroy(() => subscription.unsubscribe())

  }

}
