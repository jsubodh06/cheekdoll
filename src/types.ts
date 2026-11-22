export type SizeOption =
  | '1–2Y'
  | '2–3Y'
  | '3–4Y'
  | '4–5Y'
  | '5–6Y'
  | '7–8Y'
  | '9–10Y'
  | '11–12Y'
  | '13–14Y';

export type ProductCategory =
  | 'Dresses'
  | 'Ethnic Wear'
  | 'Party Wear'
  | 'Lehenga Sets'
  | 'Co-ord Sets'
  | 'Casual Wear'
  | 'Festive Collection';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  categories: ProductCategory[];
  occasion: 'Birthday' | 'Wedding & Festive' | 'Party' | 'Everyday' | 'Diwali & Puja';
  description: string;
  fabric: string;
  craftDetails: string;
  careInstructions: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  availableSizes: SizeOption[];
  ageGroup: string;
  color: string;
  colorHex: string;
  image: string;
  rackImage: string;
  backImage: string;
  availability: 'In Stock' | 'Low Stock' | 'Made to Order';
  stockCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface LookPiece {
  id: string;
  productId?: string;
  name: string;
  category: string;
  price: number;
  thumbnail: string;
  sizeDefault: SizeOption;
}

export interface StyledLook {
  id: string;
  indexLabel: string;
  title: string;
  subtitle: string;
  ageLabel: string;
  modelImage: string;
  pieces: LookPiece[];
  bundleDiscountPercent: number;
}

export interface MoodArchive {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  filterCategory: ProductCategory | 'All Pieces';
}

export interface StyleCardItem {
  id: string;
  productId: string;
  titleTop: string;
  titleBottom: string;
  fullTitle: string;
  price: number;
  cardBg: string;
  textColor: string;
  accentColor: string;
  image: string;
  categoryTag: string;
}

export interface ReelItem {
  id: string;
  number: string;
  duration: string;
  durationSeconds: number;
  title: string;
  category: string;
  location: string;
  image: string;
  secondaryImage: string;
  productId: string;
  caption: string;
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  size: SizeOption;
  quantity: number;
  image: string;
  category: string;
  isBundleItem?: boolean;
}

export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'Order Confirmed' | 'Atelier Tailoring' | 'Dispatched' | 'Delivered';
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  address: SavedAddress;
}

export interface UserAccount {
  name: string;
  email: string;
  phone: string;
  isSignedIn: boolean;
}

export type InfoPageKey =
  | 'about'
  | 'contact'
  | 'size-guide'
  | 'shipping'
  | 'returns'
  | 'privacy'
  | 'terms'
  | 'faqs'
  | null;
