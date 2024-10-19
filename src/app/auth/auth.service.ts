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
    public userID: string = '';
    public email: string = '';
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
        this.http.post<{token: string, activeTime: number, userID: string, email: string}>("http://localhost:3000/api/users/login", user)
         .subscribe(response => {
            const token = response.token;
            this.token = token;
            if(token){
                const now = new Date();
                const expiredDate = new Date(now.getTime() + response.activeTime * 1000);
                this.saveTokenLocal(token, expiredDate, response.userID, response.email);
                this.timer = this.settimer(response.activeTime);
                this.isAuth = true;
                this.userID = response.userID;
                this.email = response.email;
                this.authStatusListener.next(true);
                this.router.navigate(["/"]);
            }
         });
    }

    logout(){
        this.token = '';
        this.isAuth = false;
        this.authStatusListener.next(false);
        this.userID = '';
        this.email = '';
        this.clearTokenLocal();
        this.router.navigate(["/"]);
        clearTimeout(this.timer);
    }

    autoAuth(){
        const local = this.getTokenLocal();
        const token = local?.token;
        const expiredIn = local?.expiredIn;
        const userID = local?.userID;
        this.userID = userID as string;
        const email = local?.email;
        this.email = email as string;

        const now = new Date();
        if(!token || !expiredIn)
            return;
        const future = new Date(expiredIn);
        const diff = future.getTime() - now.getTime();
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

    private saveTokenLocal(token: string, duration: Date, userID: string, email: string){
        localStorage.setItem("token", token);
        localStorage.setItem("expiredIn", duration.toISOString());
        localStorage.setItem("userID", userID);
        localStorage.setItem("email", email);
    }

    private clearTokenLocal(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiredIn");
        localStorage.removeItem("userID");
        localStorage.removeItem("email");
    }

    private getTokenLocal(){
        const token = localStorage.getItem("token");
        const expiredIn = localStorage.getItem("expiredIn");
        const userID = localStorage.getItem("userID");
        const email = localStorage.getItem("email");
        if(!token || !expiredIn || !userID || !email){
            return;
        }
        return {
            token: token,
            expiredIn: expiredIn,
            userID: userID,
            email: email
        }
    }
}