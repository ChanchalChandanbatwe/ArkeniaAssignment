export interface Recipe {
  id: number;
  name: { type: String, unique: true },
  description: string;
  calories: number;
  ingredients: [];
  created_time: string;
  imageName: string;
}


export interface RecipeResponse {
  message: string;
  recipes: [];
}
