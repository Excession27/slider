import "./App.css";
import Swiper from "components/Swiper/Swiper";
import {
  firstSliderData,
  secondSliderData,
  thirdSliderData,
  firstTitle,
  secondTitle,
  thirdTitle,
} from "data";

function App() {
  return (
    <div className="container">
      <Swiper
        swiperItems={firstSliderData}
        swiperWidth={1140}
        layout={"center"}
        title={firstTitle}
        autoplay={true}
      />
      <Swiper
        swiperItems={secondSliderData}
        swiperWidth={1300}
        layout={"right"}
        title={secondTitle}
      />
      <Swiper
        swiperItems={thirdSliderData}
        swiperWidth={1440}
        layout={"left"}
        title={thirdTitle}
        autoplay={false}
      />
    </div>
  );
}

export default App;
