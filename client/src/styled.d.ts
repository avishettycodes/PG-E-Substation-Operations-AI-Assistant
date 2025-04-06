import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      white: string;
      gray: {
        light: string;
        medium: string;
        dark: string;
      };
      error: string;
      success: string;
    };
    fonts: {
      body: string;
      heading: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
      wide: string;
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
    };
    layout: {
      headerHeight: string;
      footerHeight: string;
      maxWidth: string;
      contentPadding: string;
    };
  }
} 