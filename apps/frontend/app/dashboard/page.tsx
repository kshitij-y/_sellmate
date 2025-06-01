import NavBar from "@/components/NavBar";
import { TopBar } from "@/components/TopBar";
import Loader from "@/components/ui/Loader";
export default function Home() {
  // return <Loader />
  return (
    <div className="flex flex-col min-h-full h-screen ">
      <div className="w-full px-6 border-b-1 mx-auto md:px-[5%]">
        <NavBar/>
      </div>

      {/* <div className="min-h-[50vh] mx-auto my-8 p-6 border rounded-lg shadow-lg  md:my-12 md:mx-16"></div> */}
    </div>
  );
}
