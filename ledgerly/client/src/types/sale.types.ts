export type Sale = {
  id: string;
  totalAmount: number;
  totalCost: number;
  profit: number;
  soldAt: string;

  soldBy: {
    id: string;
    fullName: string;
    email: string;
    role: "ADMIN" | "STAFF";
  };

  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    cocktail: {
      id: string;
      name: string;
    };
  }[];
};
