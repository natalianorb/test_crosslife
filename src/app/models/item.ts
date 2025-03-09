export interface Item {
  id: number;
  name: string;
}

export interface SelectableItem extends Item {
  selected: boolean;
}
