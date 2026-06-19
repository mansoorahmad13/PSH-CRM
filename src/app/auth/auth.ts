import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { apiPath, User } from '../app.variables';
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

    checkIfLoggedIn(){
        const user = localStorage.getItem('user')
        if(user){
            const userObj = JSON.parse(user)
            if(userObj.token){
                return true
            }
        }
        return false
    }

    logout() {
        const user = localStorage.getItem('user')
        if(user){
            localStorage.removeItem('user')
            this.router.navigate(['/login'])
        }
    }

}
