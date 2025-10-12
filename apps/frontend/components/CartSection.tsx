"use client";
// import { useCart } from "@/lib/hooks/useCart";
// import Loader from "./ui/Loader";
// import { toast } from "sonner";
// import { Heart, ShoppingCart, Trash } from "lucide-react";
// import { Separator } from "@/components/ui/separator";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import { Button } from "./ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// // import { useWish } from "@/lib/hooks/useWish";

// export default function CartSection() {
//   const { cartItems, removeItem, updateQuantity, loading, error } = useCart();
//   const { addToWishList } = useWish();
//   if (loading) {
//     return <Loader />;
//   }
//   if (error) {
//     toast.error(error);
//   }

//   const handleAddToCart = async (item: any) => {
//     try {
//       await addToWishList({
//         product_id: item.product_id,
//         image: item.image,
//         price: item.price,
//         title: item.title,
//       });

//       await removeItem(item.product_id);
//       toast.success("Product moved to wishlist!");
//     } catch (error) {
//       toast.error("Failed to move product to wishlist.");
//     }
//   };

//   return (
//     <div className="flex max-h-[90vh] h-fit p-8 w-full">
//       <main className="flex w-full">
//         <Card className="w-full shadow-lg rounded-lg">
//           <CardHeader>
//             <CardTitle className="flex h-12 gap-5 justify-start items-center text-2xl">
//               <ShoppingCart /> Cart
//             </CardTitle>
//           </CardHeader>
//           <Separator />
//           <CardContent className="overflow-y-auto">
//             {cartItems.length === 0 ? (
//               <p className="text-center text-gray-500">Your cart is empty.</p>
//             ) : (
//               <div className="space-y-4">
//                 {cartItems.map((item, index) => (
//                   <div
//                     key={item.product_id ?? index}
//                     className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg"
//                   >
//                     {/* Image & Details */}
//                     <div className="flex items-center gap-4 w-full sm:w-auto">
//                       <img
//                         src={item.image}
//                         alt={item.title}
//                         className="w-16 h-16 object-cover rounded-md"
//                       />
//                       <div>
//                         <h2 className="font-semibold">{item.title}</h2>
//                         <p className="text-sm text-gray-500">
//                           ₹{item.price} x {item.quantity}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between sm:justify-normal gap-4 w-full sm:w-auto">
//                       <Select
//                         value={item.quantity.toString()}
//                         onValueChange={(value) =>
//                           updateQuantity(item.product_id, Number(value))
//                         }
//                       >
//                         <SelectTrigger className="w-16">
//                           <SelectValue placeholder="Qty" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {[...Array(10)].map((_, i) => (
//                             <SelectItem key={i + 1} value={(i + 1).toString()}>
//                               {i + 1}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>

//                       <div className="font-bold whitespace-nowrap">
//                         ₹{item.price * item.quantity}
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex gap-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => removeItem(item.product_id)}
//                       >
//                         <Trash className="h-5 w-5 text-red-500" />
//                       </Button>

//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={handleAddToCart}
//                       >
//                         <Heart className="h-5 w-5 text-blue-500" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>

//           <Separator />
//           <CardFooter className="flex justify-end gap-8">
//             <div className="flex font-bold items-center gap-4">
//               Total Price:
//               <div className="px-8 py-2 border rounded-sm">
//                 ₹
//                 {cartItems.reduce(
//                   (total, item) => total + item.price * item.quantity,
//                   0
//                 )}
//               </div>
//             </div>
//             <Button variant={"destructive"} className="md:px-8">
//               Place Order
//             </Button>
//           </CardFooter>
//         </Card>
//       </main>
//     </div>
//   );
// }

export default function CartSection() {
  return (
    <div>
      Cart Section
    </div>
  )
}