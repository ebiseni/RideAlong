/// <reference types="vite/client" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': IonIconProps;
    }
  }
}

interface IonIconProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  name?: string;
  [key: string]: any;
}

export {};
