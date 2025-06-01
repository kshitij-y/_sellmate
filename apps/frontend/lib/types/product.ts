interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string[];
  condition: string;
  negotiable: boolean;
  quantity: number;
  is_auction: boolean;
  starting_bid?: number;
  bid_increment?: number;
  auction_end_time?: string;
  seller_id: string;
  seller_name: string;
  seller_contact?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default Product;