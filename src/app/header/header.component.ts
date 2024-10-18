import {Component, OnDestroy, OnInit} from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy{
    userIsAuthed = false;
    private authListenerSubs: Subscription = new Subscription;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.userIsAuthed = this.authService.getIsAuth();
        this.authListenerSubs = this.authService.getAuthStatus().subscribe( isAuth =>{
            this.userIsAuthed = isAuth;
        });
    }

    logout(){
        //console.log("log out");
        this.authService.logout();
    }

    ngOnDestroy(): void {
        this.authListenerSubs.unsubscribe();
    }
}