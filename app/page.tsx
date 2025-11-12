import Image from "next/image";
import Hero from "./components/Hero";
import About from "./components/common/About";

export default function Home() {
  return (
   <div className="bg-[#CBD99B] text-[#11224E] min-h-screen">
    <Hero/>
    <About/>
   </div>
  );
}
