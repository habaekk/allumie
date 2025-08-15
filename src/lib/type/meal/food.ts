import { Nutrition } from "./nutrition";

export interface Food {
  id: string;
  name: string;
  quantity: number;
  nutrition: Nutrition;
}