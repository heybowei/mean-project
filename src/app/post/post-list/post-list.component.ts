import { Component, OnDestroy, OnInit } from "@angular/core";
import { PostsService } from "../posts.service";
import { Post } from '../post.model'
import { Subscription } from "rxjs";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, OnDestroy{
    posts: Post[] = [];
    isLoading = false;
    private postsSub: Subscription = new Subscription();

    constructor(public postsService : PostsService){
        //this.postsSub = new Subscription();
    }

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts();
        this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
            this.posts = posts;
            this.isLoading = false;
        });
    }

    onDelete(postId: string){
        this.postsService.deletePost(postId);
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
    }
}