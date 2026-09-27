export type RoutePath = '/' | '/privacy' | '/terms' | '/support';

export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}
