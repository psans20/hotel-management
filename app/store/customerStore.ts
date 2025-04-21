import { create } from 'zustand';
import { originalMockCustomers } from '../data/originalMockData';

export interface Customer {
  id: number;
  customerRef: string;
  customerName: string;
  motherName: string;
  gender: string;
  postCode: string;
  mobile: string;
  email: string;
  nationality: string;
  idProofType: string;
  idNumber: string;
  address: string;
}

interface CustomerStore {
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: number) => void;
  setCustomers: (customers: Customer[]) => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: originalMockCustomers as Customer[],
  
  addCustomer: (customer: Customer) => 
    set((state: CustomerStore) => ({
      customers: [...state.customers, customer]
    })),
  
  updateCustomer: (customer: Customer) =>
    set((state: CustomerStore) => ({
      customers: state.customers.map((c: Customer) => 
        c.customerRef === customer.customerRef ? customer : c
      )
    })),
  
  deleteCustomer: (customerId: number) =>
    set((state: CustomerStore) => ({
      customers: state.customers.filter((c: Customer) => c.id !== customerId)
    })),
    
  setCustomers: (customers: Customer[]) =>
    set(() => ({
      customers
    }))
})); 