import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({providedIn: 'root'})
export class SignupService{
    constructor(private http: HttpClient){}
    addUser(email: string, password: string){
        const user = {
            email: email,
            password: password
        }
        this.http.post("http://localhost:3000/api/users/signup", user)
         .subscribe(response => {
            console.log(response);
         });
    }
}