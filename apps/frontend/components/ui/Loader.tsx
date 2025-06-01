import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
    </div>
  );
};

export default Loader;
