import React from "react";
import HomeSection1 from "../Components/HomeSection1";
import HomeSection2 from "../Components/HomeSection2";
import HomeSection3 from "../Components/HomeSection3";
import HomeSection4 from "../Components/HomeSection4";
import Navbar from "../Components/Navbar";
import HomeSection5 from "../Components/HomeSection5";
import Footer from "../Components/Footer";

function Home() {
  return (
    <div className="">
      <Navbar />
      <HomeSection1 />
      <HomeSection2 />
      <HomeSection3 />
      <HomeSection4 />
      <HomeSection5/>
      <Footer/>
    </div>
  );
}

export default Home;