import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    boxColor: string;
    textColor: string;
    grayTextColor: string;
    accentColor: string;
  }
}
