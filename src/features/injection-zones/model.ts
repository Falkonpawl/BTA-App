export interface InjectionZone {
  id: string;
  name: string;
  imageUrl: any;
}

export const INJECTION_ZONES: InjectionZone[] = [
  {
    id: "forehead",
    name: "Лоб",
    imageUrl: require("../../assets/images/zones/forehead.png"),
  },
  {
    id: "glabella",
    name: "Межбровье",
    imageUrl: require("../../assets/images/zones/glabella.png"),
  },
  {
    id: "eyes",
    name: "Глаза",
    imageUrl: require("../../assets/images/zones/eyes.png"),
  },
  {
    id: "nose",
    name: "Нос",
    imageUrl: require("../../assets/images/zones/nose.png"),
  },
  {
    id: "lips",
    name: "Губы",
    imageUrl: require("../../assets/images/zones/lips.png"),
  },
  {
    id: "oval",
    name: "Овал",
    imageUrl: require("../../assets/images/zones/oval.png"),
  },
  {
    id: "neck",
    name: "Шея",
    imageUrl: require("../../assets/images/zones/neck.png"),
  },
  {
    id: "masseter",
    name: "Жевательная мышца",
    imageUrl: require("../../assets/images/zones/masseter.png"),
  },
  {
    id: "temporal",
    name: "Височная мышца",
    imageUrl: require("../../assets/images/zones/temporal.png"),
  },
  {
    id: "hyperhidrosis",
    name: "Гипергидроз",
    imageUrl: require("../../assets/images/zones/hyperhidrosis.png"),
  },
];
