export type State = "active" | "default";

export type StateValue = {
  backgroundColor: string;
  avatarBackground: string;
  avatarForeground: string;
};

export type SelectorItemProps = {
  showBorder?: boolean;
  title: string;
  description?: string;
  state?: State;
};
