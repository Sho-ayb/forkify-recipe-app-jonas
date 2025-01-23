import { BASE_URL, API_KEY } from "../config";
import { Recipe, SearchResult } from "../model/interfaces";

export class RecipeService {
  //   Search for all recipes matching the user query
  async searchRecipes(query: string): Promise<SearchResult> {
    try {
      console.log("RecipeService: searches for all recipes");

      const headers = { Authorization: `Bearer: ${API_KEY}` };

      const response = await fetch(`${BASE_URL}/recipes/?search=${query}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error("Error fetching recipe");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      throw error;
    }
  }

  //   Return a single recipe from the api

  async getRecipe(id: string): Promise<Recipe> {
    try {
      const response = await fetch(`${BASE_URL}/recipes/${id}`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });

      if (!response.ok) {
        throw new Error("Error fetching recipe");
      }

      const data = await response.json();
      return data.data.recipe;
    } catch (error) {
      console.error("Error fetching recipe", error);
      throw error;
    }
  }
}
