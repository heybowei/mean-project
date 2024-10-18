import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "./auth.module";
import { raceWith, Subject } from "rxjs";
import { Router } from "@angular/router";


@Injectable({providedIn: 'root'})
export class AuthService{

    private authStatusListener = new Subject<boolean>();
    private timer: any;

    private token: string = '';
    private isAuth: boolean = false;
    constructor(private http: HttpClient, private router: Router){}
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

    getAuthStatus(){
        return this.authStatusListener.asObservable();
    }
    getIsAuth(){
        return this.isAuth;
    }

    getToken(){
        return this.token;
    }
    login(email: string, password: string){
        const user: User = {
            email: email,
            password: password
        }
        this.http.post<{token: string, activeTime: number}>("http://localhost:3000/api/users/login", user)
         .subscribe(response => {
            const token = response.token;
            this.token = token;
            if(token){
                const now = new Date();
                const expiredDate = new Date(now.getDate() + response.activeTime * 1000);
                this.saveTokenLocal(token, expiredDate);
                this.timer = this.settimer(response.activeTime);
                this.isAuth = true;
                this.authStatusListener.next(true);
                this.router.navigate(["/"]);
            }
         });
    }

    logout(){
        this.token = '';
        this.isAuth = false;
        this.authStatusListener.next(false);
        this.clearTokenLocal();
        this.router.navigate(["/"]);
        clearTimeout(this.timer);
    }

    autoAuth(){
        const local = this.getTokenLocal();
        const token = local?.token;
        const expiredIn = local?.expiredIn;
        const now = new Date();
        if(!token || !expiredIn)
            return;
        const future = new Date(expiredIn);
        const diff = now.getTime() - future.getTime();
        if(diff > 0){
            this.token = token;
            this.isAuth = true;
            this.authStatusListener.next(true);
        }

    }

    private settimer(duration: number){
        this.timer = setTimeout(()=>{
            this.logout()
        }, duration * 1000);
    }

    private saveTokenLocal(token: string, duration: Date){
        console.log("saved");
        localStorage.setItem("token", token);
        localStorage.setItem("expiredIn", duration.toISOString());
    }

    private clearTokenLocal(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiredIn");
    }

    private getTokenLocal(){
        const token = localStorage.getItem("token");
        const expiredIn = localStorage.getItem("expiredIn");
        if(!token || !expiredIn){
            return;
        }
        return {
            token: token,
            expiredIn: expiredIn
        }
    }
}