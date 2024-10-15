import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "./auth.module";


@Injectable({providedIn: 'root'})
export class AuthService{
    private token: string = '';

    constructor(private http: HttpClient){}
    addUser(email: string, password: string){
        const user: User = {
            email: email,
            password: password
        }
        this.http.post("http://localhost:3000/api/users/signup", user)
         .subscribe(response => {
            console.log(response);
         });
    }

    getToken(){
        return this.token;
    }
    login(email: string, password: string){
        const user: User = {
            email: email,
            password: password
        }
        this.http.post<{token: string}>("http://localhost:3000/api/users/login", user)
         .subscribe(response => {
            const token = response.token;
            this.token = token;
         });
    }
}