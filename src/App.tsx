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
        layout={"right"}
        title={firstTitle}
        autoplay={true}
      />
    </div>
  );
}

export default App;
