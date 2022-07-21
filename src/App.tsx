import "./App.css";
import Swiper from "components/Swiper/Swiper";
import { firstSliderData, secondSliderData } from "data";
import { useState } from "react";

function App() {
  return (
    <div className="container">
      <Swiper
        swiperItems={firstSliderData}
        swiperWidth={600}
        layout={"center"}
        title={{ tag: "", main: "", description: "" }}
      />
    </div>
  );
}

export default App;
