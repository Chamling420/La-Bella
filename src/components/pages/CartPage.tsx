"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const TAX_RATE = 0.08;

export default function CartPage() {
  const { cart, products, updateCartQuantity, removeFromCart, clearCart, setCurrentPage } =
    useAppStore();

  // Resolve cart items with product data
  const cartItems = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        ...item,
        product,
        lineTotal: product.price * item.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + tax;

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    toast("Item removed");
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    toast.success("Order placed successfully!");
    clearCart();
  };

  // ============ EMPTY STATE ============
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="mx-auto w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <ShoppingCart className="w-14 h-14 sm:w-18 sm:h-18 text-primary/40" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">
            Looks like you haven&apos;t added any products yet. Browse our collection and find something you love!
          </p>
          <Button
            size="lg"
            className="rounded-full px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            onClick={() => setCurrentPage("products")}
          >
            <ShoppingBag className="mr-2 w-5 h-5" />
            Browse Products
          </Button>
        </motion.div>
      </div>
    );
  }

  // ============ CART WITH ITEMS ============
  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold">Shopping Cart</h1>
            <Badge variant="secondary" className="text-sm">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Review your items before checkout
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* ============ CART ITEMS LIST ============ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1"
          >
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardHeader className="border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  Cart Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-4 p-4 sm:p-6 hover:bg-muted/30 transition-colors duration-200">
                        {/* Product Image */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            NPR {item.product.price.toFixed(2)} each
                          </p>
                          {item.product.category && (
                            <Badge
                              variant="outline"
                              className="mt-1 text-xs border-primary/20 text-primary"
                            >
                              {item.product.category}
                            </Badge>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-colors"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </Button>
                          <span className="w-8 text-center font-semibold text-sm tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-colors"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                        </div>

                        {/* Line Total */}
                        <div className="hidden sm:block text-right flex-shrink-0 w-24">
                          <p className="font-bold text-primary">
                            NPR {item.lineTotal.toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                          onClick={() => handleRemove(item.productId)}
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Mobile line total */}
                      <div className="sm:hidden px-4 pb-3 flex justify-end">
                        <span className="text-sm text-muted-foreground mr-2">Subtotal:</span>
                        <span className="font-bold text-primary">
                          NPR {item.lineTotal.toFixed(2)}
                        </span>
                      </div>

                      {index < cartItems.length - 1 && (
                        <Separator className="mx-4 sm:mx-6" />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>

              <CardFooter className="border-t pt-4 flex justify-between items-center">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    clearCart();
                    toast("Cart cleared");
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-primary/30 hover:bg-primary/5"
                  onClick={() => setCurrentPage("products")}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* ============ ORDER SUMMARY ============ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-80 xl:w-96"
          >
            <Card className="rounded-2xl border-0 shadow-sm sticky top-24">
              <CardHeader className="border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)}{" "}
                    {cartItems.reduce((s, i) => s + i.quantity, 0) === 1
                      ? "item"
                      : "items"}
                    )
                  </span>
                  <span className="font-medium">
                    NPR {subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    Tax ({(TAX_RATE * 100).toFixed(0)}%)
                  </span>
                  <span className="font-medium">NPR {tax.toFixed(2)}</span>
                </div>

                {/* Shipping note */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    Shipping
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-0 text-xs"
                  >
                    FREE
                  </Badge>
                </div>

                <Separator />

                {/* Grand Total */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">
                    NPR {grandTotal.toFixed(2)}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="w-full rounded-full py-6 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                  onClick={handleCheckout}
                >
                  Checkout
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Secure checkout powered by La Bella
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
