import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { SignupService } from "../signup.service";


@Component({
    templateUrl: "./signup.component.html",
    styleUrls : ["./signup.component.css"]
})
export class SignupComponent{
    isLoading = false;
    
    constructor(private signupService: SignupService){}
    onSignup(signupForm: NgForm){
        if(signupForm.invalid)
            return;
        const email = signupForm.value.email;
        const password = signupForm.value.password;
        this.signupService.addUser(email, password);
    }
}