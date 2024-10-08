import { Component, OnInit } from "@angular/core";
import { NgForm }   from '@angular/forms';
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap, RouterModule } from "@angular/router";
import { Post } from "../post.model";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrl: './post-create.component.css'
})
export class PostCreateComponent implements OnInit{
    constructor(public postsService: PostsService, public routeModule: ActivatedRoute ){}

    post: Post = {id: '', title: '', content: ''};
    private postId = '';
    private mode = 'create';
    private title = '';
    private content = '';
    
    

    ngOnInit(): void {
        this.routeModule.paramMap.subscribe((paramMap: ParamMap)=>{
            if(paramMap.has('postId')){
                this.mode = 'edit';
                this.postId = paramMap.get('postId') ?? '';
                this.title = this.postsService.getPost(this.postId).title ?? '';
                this.content = this.postsService.getPost(this.postId).content ?? '';
                this.post = {
                    id: this.postId, title: this.title, content: this.content
                }
            } else{
                this.mode = 'create';
                this.postId = '';
            }
        });
    }

    onSavePost(form: NgForm){
        if(form.invalid){
            return;
        }
        if(this.mode === 'create'){
            this.postsService.addPosts(form.value.title, form.value.content);
        } else {
            this.postsService.updatePost(this.postId, form.value.title, form.value.content);
        }
    }
}