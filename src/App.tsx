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
        swiperWidth={840}
        layout={"center"}
        title={firstTitle}
        autoplay={{ isOn: true, delay: 2000 }}
      />
      <Swiper
        swiperItems={secondSliderData}
        swiperWidth={800}
        layout={"right"}
        title={secondTitle}
        autoplay={{ isOn: true, delay: 1000 }}
      />
      <Swiper
        swiperItems={thirdSliderData}
        swiperWidth={1440}
        layout={"left"}
        title={thirdTitle}
      />
    </div>
  );
}

export default App;
