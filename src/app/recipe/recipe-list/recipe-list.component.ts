import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormControl, FormGroupDirective, FormBuilder } from '@angular/forms';
import { Recipe } from 'src/app/model/recipe';
import { RecipesService } from 'src/app/service/recipes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipeList: Recipe[] = [];
  isAscending = false;
  searchValue: string = '';
  selectedRecipe;

  constructor(private formBuilder: FormBuilder, private recipesService: RecipesService, private router: Router) {
   }



  ngOnInit(): void {
    this.recipesService.getAll();
    this.recipesService.recipeList.subscribe((data)=>{
        this.recipeList = data
    })

  }


  /**
   * sort recipe by name
   *
   * @param {string} key
   * @memberof RecipeListComponent
   */
  sortCandiates(key: string) {
    this.isAscending = !this.isAscending;
    this.recipeList = this.recipeList.sort((a, b) => {
      return a[key] > b[key]
        ? this.isAscending
          ? 1
          : -1
        : a[key] < b[key]
        ? this.isAscending
          ? -1
          : 1
        : 0;
    });
  }


  editRecipe(recipe: {}) {
    this.selectedRecipe = recipe;
  }


  deleteRecipe(recipe: {}) {
    this.recipesService.delete(recipe).subscribe(res => {
      this.recipesService.getAll();
    })
  }

}
