
import { MenuItem } from '@/types';

export const mockMenuItems: MenuItem[] = [
  // Breakfast items
  {
    id: 'item-1',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato filling served with sambar and chutney',
    price: 60,
    category: 'breakfast',
    imageUrl: 'https://res.cloudinary.com/dj5yf0qgw/image/upload/v1629880656/south-indian/masala-dosa_vgr0xo.jpg',
    ingredients: ['Rice batter', 'Urad dal', 'Potatoes', 'Onions', 'Spices'],
    status: 'available',
    prepTime: 15,
    calories: 250,
    tags: ['popular', 'spicy', 'vegetarian'],
    rating: 4.8,
    totalOrders: 1200
  },
  {
    id: 'item-2',
    name: 'Idli Sambar',
    description: 'Steamed rice cakes served with lentil soup and coconut chutney',
    price: 50,
    category: 'breakfast',
    imageUrl: 'https://res.cloudinary.com/dj5yf0qgw/image/upload/v1629880656/south-indian/idli-sambar_jlimdr.jpg',
    ingredients: ['Rice', 'Urad dal', 'Lentils', 'Vegetables', 'Spices'],
    status: 'available',
    prepTime: 10,
    calories: 180,
    tags: ['classic', 'vegetarian', 'healthy'],
    rating: 4.5,
    totalOrders: 980
  },
  {
    id: 'item-3',
    name: 'Pongal',
    description: 'Savory rice and lentil porridge with cumin, pepper, and ghee',
    price: 55,
    category: 'breakfast',
    imageUrl: 'https://res.cloudinary.com/dj5yf0qgw/image/upload/v1629880656/south-indian/pongal_evl3hc.jpg',
    ingredients: ['Rice', 'Moong dal', 'Ghee', 'Cashews', 'Spices'],
    status: 'available',
    prepTime: 20,
    calories: 310,
    tags: ['hearty', 'vegetarian', 'traditional'],
    rating: 4.3,
    totalOrders: 650
  },
  
  // Lunch items
  {
    id: 'item-4',
    name: 'South Indian Thali',
    description: 'Complete meal with rice, sambar, rasam, vegetables, curd, and papad',
    price: 120,
    category: 'lunch',
    imageUrl: 'https://res.cloudinary.com/dj5yf0qgw/image/upload/v1629880656/south-indian/south-indian-thali_wmfcqn.jpg',
    ingredients: ['Rice', 'Sambar', 'Rasam', 'Vegetables', 'Curd', 'Papad'],
    status: 'available',
    prepTime: 25,
    calories: 750,
    tags: ['complete meal', 'vegetarian', 'traditional'],
    rating: 4.7,
    totalOrders: 850
  },
  {
    id: 'item-5',
    name: 'Chettinad Chicken Curry',
    description: 'Spicy chicken curry from the Chettinad region with aromatic spices',
    price: 160,
    category: 'lunch',
    imageUrl: 'https://res.cloudinary.com/dj5yf0qgw/image/upload/v1629880657/south-indian/chettinad-chicken_yvotbu.jpg',
    ingredients: ['Chicken', 'Onions', 'Tomatoes', 'Chettinad spices', 'Coconut'],
    status: 'available',
    prepTime: 30,
    calories: 450,
    tags: ['spicy', 'non-vegetarian', 'popular'],
    rating: 4.6,
    totalOrders: 720
  },
  {
    id: 'item-6',
    name: 'Bisi Bele Bath',
    description: 'Spicy rice dish with lentils, vegetables, and special spice blend',
    price: 85,
    category: 'lunch',
    imageUrl: 'https://res.cloudinary.com/dj5yf0qgw/image/upload/v1629880657/south-indian/bisi-bele-bath_wjxgoi.jpg',
    ingredients: ['Rice', 'Toor dal', 'Vegetables', 'Tamarind', 'Spices'],
    status: 'available',
    prepTime: 25,
    calories: 380,
    tags: ['spicy', 'vegetarian', 'complete meal'],
    rating: 4.4,
    totalOrders: 580
  },
  
  // Dinner items
  {
    id: 'item-7',
    name: 'Appam with Stew',
    description: 'Lacy rice pancakes served with vegetable or chicken stew',
    price: 95,
    category: 'dinner',
    imageUrl: 'https://res.cloudinary.com/dj5yf0qgw/image/upload/v1629880657/south-indian/appam-stew_sbtvvx.jpg',
    ingredients: ['Rice flour', 'Coconut milk', 'Vegetables/Chicken', 'Spices'],
    status: 'available',
    prepTime: 25,
    calories: 320,
    tags: ['Kerala cuisine', 'light', 'dinner'],
    rating: 4.7,
    totalOrders: 490
  },
  {
    id: 'item-8',
    name: 'Hyderabadi Biryani',
    description: 'Fragrant rice dish with marinated meat and aromatic spices',
    price: 180,
    category: 'dinner',
    imageUrl: 'https://res.cloudinary.com/dj5yf0qgw/image/upload/v1629880657/south-indian/hyderabadi-biryani_yvpvnz.jpg',
    ingredients: ['Basmati rice', 'Chicken/Mutton', 'Yogurt', 'Saffron', 'Biryani spices'],
    status: 'available',
    prepTime: 40,
    calories: 650,
    tags: ['special', 'non-vegetarian', 'popular'],
    rating: 4.9,
    totalOrders: 1100
  },
  
  // Snacks
  {
    id: 'item-9',
    name: 'Medu Vada',
    description: 'Savory fried lentil donuts served with coconut chutney and sambar',
    price: 45,
    category: 'snacks',
    imageUrl: 'https://res.cloudinary.com/dj5yf0qgw/image/upload/v1629880658/south-indian/medu-vada_ylgfbx.jpg',
    ingredients: ['Urad dal', 'Rice flour', 'Onions', 'Spices'],
    status: 'available',
    prepTime: 15,
    calories: 220,
    tags: ['crispy', 'vegetarian', 'snack'],
    rating: 4.5,
    totalOrders: 820
  },
  {
    id: 'item-10',
    name: 'Mysore Pak',
    description: 'Traditional sweet made with gram flour, sugar, and ghee',
    price: 25,
    category: 'desserts',
    imageUrl: 'https://res.cloudinary.com/dj5yf0qgw/image/upload/v1629880658/south-indian/mysore-pak_cbstod.jpg',
    ingredients: ['Gram flour', 'Sugar', 'Ghee'],
    status: 'available',
    prepTime: 5,
    calories: 180,
    tags: ['sweet', 'traditional', 'vegetarian'],
    rating: 4.6,
    totalOrders: 750
  },
  
  // Beverages
  {
    id: 'item-11',
    name: 'Filter Coffee',
    description: 'Traditional South Indian coffee with frothy milk',
    price: 30,
    category: 'beverages',
    imageUrl: 'https://res.cloudinary.com/dj5yf0qgw/image/upload/v1629880658/south-indian/filter-coffee_gq84qm.jpg',
    ingredients: ['Coffee powder', 'Milk', 'Sugar'],
    status: 'available',
    prepTime: 8,
    calories: 90,
    tags: ['hot', 'beverage', 'popular'],
    rating: 4.8,
    totalOrders: 1500
  },
  {
    id: 'item-12',
    name: 'Tender Coconut Water',
    description: 'Fresh coconut water served in its shell',
    price: 40,
    category: 'beverages',
    imageUrl: 'https://res.cloudinary.com/dj5yf0qgw/image/upload/v1629880659/south-indian/tender-coconut_tzbgdh.jpg',
    ingredients: ['Fresh coconut water'],
    status: 'available',
    prepTime: 2,
    calories: 45,
    tags: ['refreshing', 'natural', 'healthy'],
    rating: 4.7,
    totalOrders: 920
  }
];
