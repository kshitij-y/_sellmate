// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import Product from "@/lib/types/product";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import { fetchProductFromId } from "@/lib/hooks/fetchProductFromId";
// import NavBar from "@/components/NavBar";
// import ImageSlider from "@/components/ImageSlider";
// import { ShoppingCart, Heart, Zap, Star, User } from "lucide-react";
// import { useCart } from "@/lib/hooks/useCart";
// import { useWish } from "@/lib/hooks/useWish";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export default function ProductDetailPage() {
//   const { id } = useParams();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [quantity, setQuantity] = useState(1);
//   const { addItems, loading, error } = useCart();
//   const { addToWishList } = useWish();

//   useEffect(() => {
//     async function fetchProduct() {
//       const data = await fetchProductFromId(id as string);
//       setProduct(data || null);
//     }

//     fetchProduct();
//   }, [id]);

//   if (!product) {
//     return (
//       <div className="p-8">
//         <Skeleton className="w-full h-[500px] mb-6" />
//         <Skeleton className="w-1/2 h-8" />
//         <Skeleton className="w-1/4 h-6 mt-2" />
//       </div>
//     );
//   }

//   const handleCart = () => {
//     addItems({
//       product_id: product.id,
//       title: product.title,
//       price: product.price,
//       quantity: quantity,
//       image: product.images[0],
//     });
//   };

//   const handleWish = () => {
//     addToWishList({
//       product_id: product.id,
//       title: product.title,
//       price: product.price,
//       image: product.images[0],
//     });
//   };

//   return (
//     <div className="flex flex-col w-full min-h-screen bg-background">
//       <NavBar />

//       <div className="flex flex-col lg:flex-row gap-6 px-4 py-8 max-w-7xl mx-auto w-full">
//         {/* Image Section */}
//         <div className="w-full lg:w-1/2 flex justify-center items-start">
//           <div className="relative max-w-[500px] border py-2 rounded-md w-full">
//             <ImageSlider image={product.images} />
//           </div>
//         </div>

//         {/* Product Details */}
//         <div className="w-full lg:w-1/2 flex flex-col justify-start gap-4">
//           <h1 className="text-2xl font-semibold">{product.title}</h1>
//           <p className="text-muted-foreground">{product.description}</p>
//           <div className="text-xl font-bold text-primary">₹{product.price}</div>

//           {/* Quantity Dropdown */}
//           <div className="flex items-center gap-4 mt-4">
//             <label
//               htmlFor="quantity"
//               className="font-semibold text-sm text-muted-foreground">
//               Quantity
//             </label>
//             <Select
//               value={quantity.toString()}
//               onValueChange={(value) => setQuantity(Number(value))}
//             >
//               <SelectTrigger className="w-16">
//                 <SelectValue placeholder="Qty" />
//               </SelectTrigger>
//               <SelectContent>
//                 {[...Array(10)].map((_, i) => (
//                   <SelectItem key={i + 1} value={(i + 1).toString()}>
//                     {i + 1}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 mt-6">
//             {/* <Button
//               variant="default"
//               className="w-full sm:w-auto bg-primary font-semibold px-6 py-3 gap-2"
//               onClick={handleCart}
//             >
//               <Zap className="h-4 w-4" />
//               Buy Now
//             </Button> */}

//             <Button
//               variant="default"
//               className="w-full sm:w-auto font-semibold px-6 py-3 gap-2"
//               onClick={handleCart}>
//               <ShoppingCart className="h-4 w-4" />
//               Add to Cart
//             </Button>

//             <Button
//               variant="ghost"
//               className="w-full sm:w-auto text-muted-foreground px-6 py-3 gap-2"
//               onClick={handleWish}>
//               <Heart className="h-4 w-4" />
//               Add to Wishlist
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Reviews */}
//       <div className="border rounded-2xl p-8 max-w-7xl mx-auto w-full max-h-[600px] overflow-y-auto custom-scroll-hide mb-10">
//         <div className="mt-4 space-y-6">
//           <h2 className="text-xl font-semibold">Customer Reviews</h2>

//           {/* Average Rating */}
//           <div className="flex items-center gap-2 text-yellow-500">
//             <Star className="h-5 w-5 fill-yellow-500" />
//             <span className="text-lg font-medium text-foreground">
//               4.5 out of 5
//             </span>
//             <span className="text-sm text-muted-foreground">(124 ratings)</span>
//           </div>

//           {/* Review List */}
//           <div className="space-y-4">
//             {[...Array(10)].map((_, i) => (
//               <div
//                 key={i}
//                 className="border rounded-xl p-4 space-y-3 shadow-sm bg-muted/20">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-muted rounded-full p-2">
//                     <User className="h-5 w-5 text-muted-foreground" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-semibold text-sm">John Doe</p>
//                     <div className="flex gap-1 text-yellow-500">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="w-4 h-4 fill-yellow-500" />
//                       ))}
//                       <Star className="w-4 h-4 text-muted fill-muted" />
//                     </div>
//                   </div>
//                 </div>
//                 <p className="text-sm text-muted-foreground line-clamp-3">
//                   Great product! Delivered on time and works perfectly. Highly
//                   recommend if you’re into tech.
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function Page() {
  return (
    <div>
      page
    </div>
  )
}