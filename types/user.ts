export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  phoneNumber: string | null;
  shippingAddress: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  shippingAddress: string;
}

export interface AddressFormData {
  shippingAddress: string;
}