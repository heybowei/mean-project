import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";


@Component({
    templateUrl: "./signup.component.html",
    styleUrls : ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy{
    isLoading = false;
    authServiceSub = new Subscription();
    
    constructor(private authService: AuthService){}

    ngOnInit(): void {
        this.authServiceSub = this.authService.authStatusListener.subscribe();
    }
    
    onSignup(signupForm: NgForm){
        if(signupForm.invalid)
            return;
        const email = signupForm.value.email;
        const password = signupForm.value.password;
        this.authService.addUser(email, password);
    }

    ngOnDestroy(): void {
        this.authServiceSub.unsubscribe();
    }
}