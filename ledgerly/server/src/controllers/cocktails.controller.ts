import { Request, Response } from "express";
import * as cocktailService from "./cocktails.service";

export async function createCocktail(req: Request, res: Response) {
  const data = req.body;

  const cocktail = await cocktailService.createCocktail(data);

  res.status(201).json(cocktail);
}

export async function getCocktails(req: Request, res: Response) {
  const cocktails = await cocktailService.getCocktails();

  res.json(cocktails);
}

export async function getCocktailById(req: Request, res: Response) {
  const id = req.params.id as string;

  const cocktail = await cocktailService.getCocktailById(id);

  res.json(cocktail);
}

export async function deleteCocktail(req: Request, res: Response) {
  const id = req.params.id as string;

  await cocktailService.deleteCocktail(id);

  res.status(204).send();
}
