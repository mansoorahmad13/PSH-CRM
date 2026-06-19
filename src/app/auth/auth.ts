import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { apiPath, User } from '../app.variables';
import { Router } from '@angular/router';
import { LoginResponse } from './auth.model';


@Service()
export class Auth {
    private httpClient = inject(HttpClient)
    private router = inject(Router)

    get user() {
        const user = localStorage.getItem('user')
        if(user){
            return JSON.parse(user)
        }
    }

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

    checkIfLoggedIn(){
        const user = this.user
        return user && true
    }

    logout() {
        const user = this.user
        if(user){
            localStorage.removeItem('user') 
            this.router.navigate(['/login'])
        }
    }

    get token() {
        const user = this.user
        return user && user.token
    }

}
