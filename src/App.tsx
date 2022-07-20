import './App.css';
import Swiper from './components/Swiper';

function App() {
  const items = [
    {
      imageSrc: "https://framed.shindiristudio.com/wp-content/uploads/2016/04/Accordion-2.jpg",
      imageAlt: "A person's eye",
    },
    {
      imageSrc: "https://framed.shindiristudio.com/wp-content/uploads/2016/04/Accordion-5.jpg",
      imageAlt: 'A rock formation',
    },
    {
      imageSrc: "https://framed.shindiristudio.com/wp-content/uploads/2016/04/Accordion-3.jpg",
      imageAlt: 'Some flowers',
    },
    {
      imageSrc: "https://framed.shindiristudio.com/wp-content/uploads/2016/04/Accordion-4.jpg",
      imageAlt: 'An egyptian wall painting',
    }
  ];

  return (
    <div className="container">
      
      <Swiper items={items} sliderWidth={600} layout={"center"}/>

    </div>
  );
}

export default App;
