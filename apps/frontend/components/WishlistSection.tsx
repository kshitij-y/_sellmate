"use client";
// import { useWish } from "@/lib/hooks/useWish";
// import Loader from "./ui/Loader";
// import { toast } from "sonner";
// import { Heart, Trash } from "lucide-react";
// import { Separator } from "@/components/ui/separator";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import { Button } from "./ui/button";

// export default function WishlistSection() {
//   const { wishItems, removeFromWish, loading, error } = useWish();
//   if (loading) return <Loader />;
//   if (error) toast.error(error);

//   return (
//     <div className="flex max-h-[90vh] h-fit p-8 w-full">
//       <main className="flex w-full">
//         <Card className="w-full shadow-lg rounded-lg">
//           <CardHeader>
//             <CardTitle className="flex h-12 gap-5 justify-start items-center text-2xl">
//               <Heart /> Wishlist
//             </CardTitle>
//           </CardHeader>
//           <Separator />
//           <CardContent className="overflow-y-auto">
//             {wishItems.length === 0 ? (
//               <p className="text-center text-gray-500">
//                 Your wishlist is empty.
//               </p>
//             ) : (
//               <div className="space-y-4">
//                 {wishItems.map((item, index) => (
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
//                         <p className="text-sm text-gray-500">₹{item.price}</p>
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex gap-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => removeFromWish(item.product_id)}
//                       >
//                         <Trash className="h-5 w-5 text-red-500" />
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
//               Total Items:
//               <div className="px-8 py-2 border rounded-sm">
//                 {wishItems.length}
//               </div>
//             </div>
//           </CardFooter>
//         </Card>
//       </main>
//     </div>
//   );
// }

export default function WishlistSection() {
  return (
    <div>
      WIshlist Page
    </div>
  )
}