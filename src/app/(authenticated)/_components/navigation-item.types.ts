export type NavigationItemProps = {
  href: string;
  iconPath: string;
  selectedIconPath?: string;
  label: string;
  /**
   * Match the route exactly instead of by prefix. Needed for an item whose href
   * is a prefix of its siblings' routes (e.g. "/accounting" overview vs the
   * "/accounting/*" workspace pages) so it isn't perpetually highlighted.
   */
  exact?: boolean;
};
