export type State = "active" | "default";

export type StateValue = {
  backgroundColor: string;
  avatarBackground: string;
  avatarForeground: string;
};

export type SelectorItemProps<T = unknown> = {
  showBorder?: boolean;
  title: string;
  description?: string;
  state?: State;
  onClick?: (item: T) => void;
};
