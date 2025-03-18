export interface Ingredient {
  quantity: number | null;
  unit: string;
  description: string;
}

export interface Recipe {
  id: string;
  title: string;
  publisher: string;
  image_url: string;
  source_url: string;
  servings: number;
  cooking_time: number;
  ingredients: Ingredient[];
  bookmarked?: boolean;
}

export interface SearchRecipe {
  id: string;
  image_url: string;
  publisher: string;
  title: string;
}

export interface SearchResult {
  data: {
    recipes: SearchRecipe[];
  };
  results: number;
  status: string;
  query?: string;
  page?: number;
  resultsPerPage?: number;
}

export interface AppState {
  bookmarks: Recipe[];
  searchResults: SearchResult;
  recipe: Recipe | undefined;
}

export interface Observer {
  update(state: AppState): void;
}
