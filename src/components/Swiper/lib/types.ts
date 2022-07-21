export type SwiperItemType = {
  img: string;
  description: string;
};

type TitleType = {
  tag: string;
  main: string;
  description: string;
};

export type SwiperPropsType = {
  swiperItems: SwiperItemType[];
  title: TitleType;
  layout: "left" | "center" | "right";
  swiperWidth: number;
  autoplay?: boolean;
};
