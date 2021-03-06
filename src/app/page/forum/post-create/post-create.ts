import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import {
    UserService,
    ForumService,
    ApiService,
    CATEGORIES,
    POST, POSTS
} from './../../../../firebase-backend/firebase-backend.module';

@Component({
    selector: 'post-create-component',
    templateUrl: 'post-create.html'
})

export class PostCreateComponent implements OnInit {


    // post create form
    postFormGroup: FormGroup;
    postError: string = '';


    categories: CATEGORIES = [];

    constructor(
        private fb: FormBuilder,
        public user: UserService,
        private api: ApiService,
        private forum: ForumService
    ) {
        console.log("PostCreateCompoennt::constructor() begins");
        this.init();
    }

    ngOnInit() { }


    init() {

        this.getCategories();

        this.postFormGroup = this.fb.group({
            subject: [],
            content: [],
            categories: [[]]
        });
    }
    

    getCategories() {
        this.forum.observeCategory().subscribe(res => {
            console.log(res);
            this.categories = res;
            // this.postFormGroup.get('categories').setValue( this.categories );
            // console.log( this.postFormGroup.value );
        });
    }



    onChangePostFormCategory($event) {
        let checked = $event.target.checked;
        let value = $event.target.value;
        let categoryArray = this.postFormGroup.get('categories').value;
        if (checked) { // add
            categoryArray.push(value);
        }
        else { // remove
            categoryArray = categoryArray.filter(v => v !== value)
        }
        this.postFormGroup.get('categories').setValue(categoryArray);
        console.log(this.postFormGroup.value);
    }


    onSubmitPostForm() {
        let form: POST = this.postFormGroup.value;
        console.log("Going to create a post : ", form);


        form.uid = this.user.uid;
        form.name = this.user.name;

        this.api.post(form).subscribe(key => {
            console.log("Post create with key: ", key);
        }, e => {
            console.error(e);
        });

    }


}