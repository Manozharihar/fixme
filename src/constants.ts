import { Guide, Part } from "./types";

export const MOCK_PARTS: Part[] = [
  {
    id: "p1",
    name: "MacBook Pro 13\" (A2338) Battery",
    price: 0.011,
    image: "61cILglrAeL.jpg?w=400",
    category: "Mobile & Electronics",
    compatibility: ["MacBook Pro 13\" M1", "MacBook Pro 13\" M2"],
    inStock: true,
    successRate: 98
  },
  {
    id: "p2",
    name: "Mahindra Air Filter Assembly",
    price: 0.012,
    image: "https://images.unsplash.com/photo-1599933310633-2fc025fe2b88?w=400",
    category: "Farming Equipment",
    compatibility: ["Mahindra OJA Series", "Mahindra Jivo"],
    inStock: true,
    successRate: 100
  },
  {
    id: "p3",
    name: "S22 Ultra OLED Screen Assembly",
    price: 245.00,
    image: "https://images.unsplash.com/photo-1616422285623-13ff0167c95c?w=400",
    category: "Mobile & Electronics",
    compatibility: ["Galaxy S22 Ultra (India Version)"],
    inStock: true,
    successRate: 78
  },
  {
    id: "p4",
    name: "Kent RO Membrane 75 GPD",
    price: 32.00,
    image: "https://images.unsplash.com/photo-1581092160192-726f60817b11?w=400",
    category: "Consumer Durables",
    compatibility: ["Kent Grand", "Kent Pearl", "Active Copper"],
    inStock: true,
    successRate: 95
  },
  {
    id: "p5",
    name: "Hero Splendor Brake Shoe",
    price: 4.50,
    image: "https://images.unsplash.com/photo-1485908953470-6ddb99184149?w=400",
    category: "Automobile Equipment",
    compatibility: ["Hero Splendor", "Hero Passion"],
    inStock: true,
    successRate: 99
  }
];

export const CATEGORIES = ["Farming Equipment", "Mobile & Electronics", "Consumer Durables", "Automobile Equipment"];
