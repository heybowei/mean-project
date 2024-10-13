import { Component, OnDestroy, OnInit } from "@angular/core";
import { PostsService } from "../posts.service";
import { Post } from '../post.model'
import { Observable, Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, OnDestroy{

    postPerPage = 2;
    postLength = 10;
    currentPage = 1;
    pageSizeOptions = [2, 5, 10, 20];
    posts: Post[] = [];
    maxPosts = 0;
    isLoading = false;
    private postsSub: Subscription = new Subscription();

    constructor(public postsService : PostsService){
        //this.postsSub = new Subscription();
    }

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.postPerPage, this.currentPage);
        this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData: {posts: Post[], maxPosts: number}) => {
            this.posts = postData.posts;
            this.maxPosts = postData.maxPosts;
            this.isLoading = false;
        });
        
    }

    onDelete(postId: string){
        this.isLoading = true;
        this.postsService.deletePost(postId)
        .subscribe(() =>{
            this.postsService.getPosts(this.postPerPage, this.currentPage);
        });
        
    }

    pageChanged(pageData : PageEvent){
        this.isLoading = true;
        this.postPerPage = pageData.pageSize;
        this.currentPage = pageData.pageIndex + 1;
        this.postsService.getPosts(this.postPerPage, this.currentPage);
    }
    ngOnDestroy() {
        this.postsSub.unsubscribe();
    }
}