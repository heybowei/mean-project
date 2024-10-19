import { Post } from './post.model';
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { map } from'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostsService{
    private posts: Post[] = [];    private postsUpdate = new Subject<{posts: Post[], maxPosts: number}>();
    constructor(private http: HttpClient, private router: Router){}

    getPosts(postPerPage: number, page: number){
        const query = `?pagesize=${postPerPage}&page=${page}`;
        this.http.get<{message: string, posts: any, postsCount: number}>("http://localhost:3000/api/posts" + query)
         .pipe(map((postData) =>{
            console.log(postData);
            return {
                post: postData.posts.map((post: any) =>{
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        filePath: post.filePath,
                        creator: post.creator
                    };
                }),
                maxPosts: postData.postsCount
            };
         })).subscribe((inipost)=>{
            this.posts = inipost.post;
            this.postsUpdate.next({posts: [...this.posts], maxPosts: inipost.maxPosts});
        });
    }

    getPost(postId: string){
        return this.http.get<{title: string, content: string, filePath: string, creator: string}>("http://localhost:3000/api/posts/" + postId);
        //return {...this.posts.find(p => p.id === postId)};
    }


    getPostUpdateListener(){
        return this.postsUpdate.asObservable();
    }

    addPosts(title: string, content: string, image: File){
        //const post: Post = { id: '', title: title, content: content, filePath: ''};
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
        this.http.post<{message: string, post: Post}>("http://localhost:3000/api/posts", postData)
         .subscribe((response) =>{
            this.router.navigate(["/"]);
         })
    }

    updatePost(Id:string, title: string, content: string, file: any){
        let postData : Post| FormData;
        if(typeof(file) === 'object'){
            postData = new FormData();
            postData.append("title", title);
            postData.append("content", content);
            postData.append("id", Id);
            postData.append("image", file, title);
        } else {
            postData = {
                id: Id,
                title: title,
                content: content,
                filePath: file,
                creator: ''
            }; 
        }
        this.http.put("http://localhost:3000/api/posts/" + Id, postData)
         .subscribe((response) =>{
            this.router.navigate(["/"]);
         });
    }

    deletePost(postId: string){
        return this.http.delete("http://localhost:3000/api/posts/" + postId);
    }
}