import BuySellAuction from "@/components/BuySellAuction";
import { Signup } from "@/components/signup";
import { TopBar } from "@/components/TopBar";
export default function Page() {
  return (
    <div className="flex items-center min-h-screen">
      <div className="hidden lg:block w-[30%] bg-black h-screen">
        <div className="w-full mx-auto fixed top-0 left-0 right-0 text-white border-b py-2 px-4 border-white/20">
          <TopBar auth={false} />
        </div>
        <div className="mt-4">
          <img
            src="https://cdn.dribbble.com/uploads/60700/original/bb339e5ba35e549b32d989be548c908d.png?1740610182"
            alt="Framer logo"></img>
        </div>
        <BuySellAuction />
      </div>
      <div className="mx-auto ">
        <Signup />
      </div>
    </div>
  );
}
