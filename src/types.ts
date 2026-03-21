export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  image: any; // Sanity Image object
  images?: any[]; // Array of Sanity Image objects
  videoUrl?: string;
  reviews?: {
    _key?: string;
    name: string;
    rating: number;
    comment: string;
  }[];
  price: number;
  rating: number;
  description: string;
  category: 'Kids' | 'Beauty' | 'Fashion' | 'Home & Design';
  discount: number;
  affiliateLink: string;
  isFeatured: boolean;
  status: 'Active' | 'Expired';
  createdAt: string;
}
