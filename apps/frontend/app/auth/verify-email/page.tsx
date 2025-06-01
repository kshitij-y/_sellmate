import { TopBar } from "@/components/TopBar";
import { OtpVerify } from "@/components/OtpVerify";

export default function Page() {
  return (
    <div className="flex items-center min-h-screen">
      <div className="w-full px-6 mx-auto fixed top-0 left-0 right-0 border-b-1">
        <TopBar auth={ false } />
      </div>
      <div className="flex justify-center w-full mt-12">
          <OtpVerify />
      </div>
    </div>
  );
}
