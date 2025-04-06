import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* PG&E Brand Colors */
    --pg-e-blue: #0072CE;
    --pg-e-blue-dark: #005DA8;
    --pg-e-blue-light: #E3F2FD;
    --pg-e-yellow: #FEC200;
    --pg-e-yellow-dark: #F5B700;
    --pg-e-gray-dark: #333333;
    --pg-e-gray: #666666;
    --pg-e-gray-light: #CCCCCC;
    --pg-e-gray-lighter: #F7F7F7;
    --pg-e-white: #FFFFFF;
    
    /* Font sizes */
    --font-xs: 12px;
    --font-sm: 14px;
    --font-md: 16px;
    --font-lg: 18px;
    --font-xl: 24px;
    --font-xxl: 36px;
    --font-hero: 48px;
    
    /* Spacing */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
    --space-xxl: 48px;
    
    /* Layout widths */
    --container-width: 1200px;
    
    /* Border radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    
    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 2px 6px rgba(0, 0, 0, 0.15);
    --shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    height: 100%;
    width: 100%;
  }
  
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: var(--pg-e-gray-dark);
    line-height: 1.5;
    font-size: var(--font-md);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--pg-e-gray-lighter);
  }
  
  #root {
    height: 100%;
  }
  
  a {
    color: var(--pg-e-blue);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  button {
    cursor: pointer;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: var(--space-md);
  }
  
  h1 {
    font-size: var(--font-xxl);
  }
  
  h2 {
    font-size: var(--font-xl);
  }
  
  h3 {
    font-size: var(--font-lg);
  }
  
  p {
    margin-bottom: var(--space-md);
  }
  
  ul, ol {
    margin-bottom: var(--space-md);
    padding-left: var(--space-xl);
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  /* Utility classes */
  .container {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 0 var(--space-md);
  }
  
  .card {
    background-color: var(--pg-e-white);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    padding: var(--space-lg);
  }
  
  .btn {
    display: inline-block;
    background-color: var(--pg-e-blue);
    color: var(--pg-e-white);
    padding: var(--space-sm) var(--space-lg);
    border-radius: var(--radius-sm);
    border: none;
    font-weight: 600;
    font-size: var(--font-md);
    text-decoration: none;
    text-align: center;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: var(--pg-e-blue-dark);
      text-decoration: none;
    }
    
    &.btn-yellow {
      background-color: var(--pg-e-yellow);
      
      &:hover {
        background-color: var(--pg-e-yellow-dark);
      }
    }
    
    &.btn-outline {
      background-color: transparent;
      border: 2px solid var(--pg-e-blue);
      color: var(--pg-e-blue);
      
      &:hover {
        background-color: var(--pg-e-blue-light);
      }
    }
  }
  
  .text-center {
    text-align: center;
  }
  
  .mb-0 {
    margin-bottom: 0;
  }
  
  .mb-1 {
    margin-bottom: var(--space-sm);
  }
  
  .mb-2 {
    margin-bottom: var(--space-md);
  }
  
  .mb-3 {
    margin-bottom: var(--space-lg);
  }
  
  .mb-4 {
    margin-bottom: var(--space-xl);
  }
  
  .mb-5 {
    margin-bottom: var(--space-xxl);
  }
  
  /* Responsive utilities */
  @media (max-width: 768px) {
    :root {
      --font-hero: 36px;
      --font-xxl: 28px;
      --font-xl: 22px;
    }
    
    .hide-mobile {
      display: none;
    }
  }
`;

export default GlobalStyles; 