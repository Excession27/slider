export type SwiperItemType = {
  img: string;
  description: string;
};

export type TitleType = {
  tag: string;
  main: string;
  description: string;
};

export type LayoutType = {
  layout: "left" | "center" | "right";
};

export type SwiperPropsType = LayoutType & {
  swiperItems: SwiperItemType[];
  title: TitleType;
  swiperWidth: number;
  autoplay?: { isOn: boolean; delay: number };
};
