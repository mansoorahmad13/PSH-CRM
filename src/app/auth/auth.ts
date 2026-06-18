import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { apiPath, User } from '../crm.variables';
import { Router } from '@angular/router';
import { LoginResponse } from './auth.model';


@Service()
export class Auth {
    private httpClient = inject(HttpClient)
    private router = inject(Router)

    login(email: string, password: string) {
        return this.httpClient.post<LoginResponse>(apiPath + 'login', {
            email,
            password
        })
    }

    saveUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user))
        this.router.navigate(['/'])
    }

}
