import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { GetCart, AddToCart as addToCartService, UpdateCartItem as updateCartItemService, RemoveFromCart as removeFromCartService, ClearCart as clearCartService } from "../services/cart.service";

interface CartContextType {
    cart: any;
    cartCount: number;
    loading: boolean;
    refreshing: boolean;
    fetchCart: (silent?: boolean) => Promise<void>;
    addItem: (productId: string, quantity?: number) => Promise<boolean>;
    updateQuantity: (id: string, quantity: number) => Promise<boolean>;
    removeItem: (id: string) => Promise<boolean>;
    clearCart: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<any>(null);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCart = async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setCart(null);
                setCartCount(0);
                return;
            }

            const res = await GetCart();
            if (res.success) {
                setCart(res.data);
                const count = res.data.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
                setCartCount(count);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const addItem = async (product_id: string, quantity: number = 1) => {
        try {
            setRefreshing(true);
            const res = await addToCartService({ product_id, quantity });
            if (res.success) {
                await fetchCart(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error adding to cart:", error);
            return false;
        } finally {
            setRefreshing(false);
        }
    };

    const updateQuantity = async (id: string, quantity: number) => {
        if (quantity < 1) return false;
        try {
            setRefreshing(true);
            const res = await updateCartItemService(id, { quantity });
            if (res.success) {
                await fetchCart(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error updating cart quantity:", error);
            return false;
        } finally {
            setRefreshing(false);
        }
    };

    const removeItem = async (id: string) => {
        try {
            setRefreshing(true);
            const res = await removeFromCartService(id);
            if (res.success) {
                await fetchCart(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error removing from cart:", error);
            return false;
        } finally {
            setRefreshing(false);
        }
    };

    const clearCart = async () => {
        try {
            setRefreshing(true);
            const res = await clearCartService();
            if (res.success) {
                setCart(null);
                setCartCount(0);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error clearing cart:", error);
            return false;
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <CartContext.Provider 
            value={{ 
                cart, 
                cartCount, 
                loading, 
                refreshing, 
                fetchCart, 
                addItem, 
                updateQuantity, 
                removeItem, 
                clearCart 
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
