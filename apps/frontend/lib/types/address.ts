export default interface Address {
  id: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  phone: string;
  pin_code: string;
  country: string;
  is_default: boolean;
}
