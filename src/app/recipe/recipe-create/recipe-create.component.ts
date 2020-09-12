import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl, FormGroupDirective, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipesService } from 'src/app/service/recipes.service';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit, OnChanges {

  recipeForm:FormGroup;
  form: FormGroup;
  @Input() selectedRecipe;
  formButton: String = 'Add';
  selected;
  submitted: Boolean = false;
  isLogoUpdated: Boolean = false;
  formData = new FormData();
  file: any;
  formError: any;
  @ViewChild('upload') uploadField: ElementRef;

  constructor(private formBuilder: FormBuilder, private recipesService: RecipesService, private router: Router) {
  }

  ngOnInit(): void {

    this.addRecipeForm();

    this.form = this.formBuilder.group({
      file: [''],
    });

  }

  ngOnChanges(obj): void {
    if(obj.selectedRecipe.currentValue!==undefined) {
      this.formButton = 'Update';
      this.selected = obj.selectedRecipe.currentValue;
      this.recipeForm = new FormGroup({
        name:new FormControl(this.selected.name,[Validators.required]),
        description:new FormControl(this.selected.description,[Validators.required]),
        calories:new FormControl(this.selected.calories,[Validators.required]),
        ingredients:new FormControl(this.selected.ingredients,[Validators.required]),
        imageName: new FormControl(this.selected.imageName)
      });

    }
  }

  addRecipeForm() {
    this.recipeForm = new FormGroup({
      name:new FormControl('',[Validators.required]),
      description:new FormControl('',[Validators.required]),
      calories:new FormControl('',[Validators.required]),
      ingredients:new FormControl('',[Validators.required]),
      imageName: new FormControl(''),
    })

    // this.form.get('file').setValue('');
    // this.uploadField.nativeElement.value = '';
    this.isLogoUpdated = false;
  }

  addRecipe(formDirective: FormGroupDirective) {

    this.submitted = true;
    if (this.recipeForm.valid) {
      this.submitted = false;
      if (this.isLogoUpdated) {
        this.recipesService.uploadImage(this.formData).subscribe((response) => {
          this.form.get('file').setValue('');
          this.uploadField.nativeElement.value = '';
          this.isLogoUpdated = false;
        });
      }

      if(this.formButton==='Add') {
        this.recipesService.create(this.recipeForm.value).subscribe(res => {
          this.recipesService.getAll();
        })
      } else {
        this.recipeForm.value.id = this.selected._id
        this.recipesService.update(this.recipeForm.value).subscribe(res => {
          this.recipesService.getAll();
        })
      }
      this.recipeForm.reset();
    }
  }

  fileChange(e) {
    this.formData = new FormData();
    if (e.target.files.length > 0) {
      this.file = e.target.files[0];
      // if (this.file !== undefined) {
      if (this.file.type && this.file.type !== 'image/png' && this.file.type !== 'image/jpeg') {

        this.formError.file = "Please upload jpeg/png file type."
        this.form.get('file').setValue('');
        this.uploadField.nativeElement.value = '';
      } else {
        this.isLogoUpdated = true;
        this.form.get('file').setValue(this.file);
        this.formData.append('image', this.form.get('file').value);
        this.recipeForm.get('imageName').setValue(this.form.value.file.name);
      }
    }
  }

}
