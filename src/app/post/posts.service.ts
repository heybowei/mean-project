import { Post } from './post.model';
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
@Injectable({providedIn: 'root'})
export class PostsService{
    private posts: Post[] = [];
    private postsUpdate = new Subject<Post[]>();

    getPosts(){
        return [...this.posts];
    }
    getPostUpdateListener(){
        return this.postsUpdate.asObservable();
    }

    addPosts(title: string, content: string){
        const post: Post = {title, content};
        this.posts.push(post);
        this.postsUpdate.next([...this.posts]);
    }
}