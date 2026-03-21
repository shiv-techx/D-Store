export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  image: any; // Sanity Image object
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
