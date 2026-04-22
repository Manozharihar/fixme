export interface Step {
  title: string;
  text: string;
  image: string;
}

export interface Guide {
  id: string;
  name: string;
  device: string;
  category: string;
  difficulty: "Easy" | "Moderate" | "Difficult";
  time: string;
  score: number;
  steps: Step[];
  tools: string[];
  parts: string[];
}

export interface Part {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  compatibility: string[];
  inStock: boolean;
  successRate: number;
}
