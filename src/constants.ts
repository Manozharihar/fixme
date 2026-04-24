import { Guide, Part } from "./types";

export const MOCK_GUIDES: Guide[] = [
  {
    id: "145677",
    name: "MacBook Pro 14\" 2021 Battery Replacement",
    device: "MacBook Pro 14\"",
    category: "Computers",
    difficulty: "Difficult",
    time: "2-3 hours",
    score: 6,
    steps: [],
    tools: ["P5 Pentalobe", "T5 Torx", "Suction Handle"],
    parts: ["MacBook Pro 14\" Battery"]
  },
  {
    id: "135702",
    name: "iPhone 12 Screen Replacement",
    device: "iPhone 12",
    category: "Mobile",
    difficulty: "Moderate",
    time: "1-2 hours",
    score: 8,
    steps: [],
    tools: ["P2 Pentalobe", "Tri-point Y000", "Phillips #000"],
    parts: ["iPhone 12 Screen Assembly"]
  },
  {
    id: "104033",
    name: "Nintendo Switch Battery Replacement",
    device: "Nintendo Switch",
    category: "Consoles",
    difficulty: "Easy",
    time: "30-45 minutes",
    score: 9,
    steps: [],
    tools: ["JIS 000", "Phillips #00", "Spudger"],
    parts: ["Switch Replacement Battery"]
  },
  {
    id: "149254",
    name: "Steam Deck SSD Replacement",
    device: "Steam Deck",
    category: "Consoles",
    difficulty: "Moderate",
    time: "20-30 minutes",
    score: 9,
    steps: [],
    tools: ["Phillips #1", "Tweezers", "Spudger"],
    parts: ["M.2 2230 NVMe SSD"]
  }
];

export const MOCK_PARTS: Part[] = [
  {
    id: "p1",
    name: "MacBook Pro 13\" (A2338) Battery",
    price: 100.00,
    image: "https://laptopgallery.co.in/wp-content/uploads/2023/01/5.png?w=400",
    category: "Mobile & Electronics",
    compatibility: ["MacBook Pro 13\" M1", "MacBook Pro 13\" M2"],
    inStock: true,
    successRate: 98
  },
  {
    id: "p2",
    name: "Mahindra Air Filter Assembly",
    price: 95.00,
    image: "https://m.media-amazon.com/images/I/314qVeZGJjL._SX425_.jpg?w=400",
    category: "Farming Equipment",
    compatibility: ["Mahindra OJA Series", "Mahindra Jivo"],
    inStock: true,
    successRate: 100
  },
  {
    id: "p3",
    name: "S22 Ultra OLED Screen Assembly",
    price: 245.00,
    image: "https://tse3.mm.bing.net/th/id/OIP.C8kyUjFdPFFIVHq3vSorxQHaHa?w=400",
    category: "Mobile & Electronics",
    compatibility: ["Galaxy S22 Ultra (India Version)"],
    inStock: true,
    successRate: 78
  },
  {
    id: "p4",
    name: "Kent RO Membrane 75 GPD",
    price: 32.00,
    image: "https://m.media-amazon.com/images/I/716ltPYgDAL._SY879_.jpg?w=400",
    category: "Consumer Durables",
    compatibility: ["Kent Grand", "Kent Pearl", "Active Copper"],
    inStock: true,
    successRate: 95
  },
  {
    id: "p5",
    name: "Hero Splendor Brake Shoe",
    price: 4.50,
    image: "https://5.imimg.com/data5/SELLER/Default/2021/4/FO/TE/NN/119107773/hero-splendor-brake-shoe-1000x1000.jpg?w=400",
    category: "Automobile Equipment",
    compatibility: ["Hero Splendor", "Hero Passion"],
    inStock: true,
    successRate: 99
  }
];

export const CATEGORIES = ["Farming Equipment", "Mobile & Electronics", "Consumer Durables", "Automobile Equipment"];
