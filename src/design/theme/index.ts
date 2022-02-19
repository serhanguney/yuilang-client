import {colors} from '../fixedValues';
import {createGlobalStyle} from 'styled-components';

export type AppearanceNames = 'submit' | 'cancel' | 'regular' | 'button';
type Elements = 'text' | 'background';
type Colors = {
    submit: string;
    cancel: string;
    regular: string;
    button: string;
};
type CircleColors = {
    textColor: string;
    pathColor: string;
    trailColor: string;
};
type CircleType = {
    regular: CircleColors;
    submit: CircleColors;
};
type Theme = {
    colors: {
        text: Colors;
        background: Colors;
        circle: CircleType;
    };
    getAppearanceColor: Function;
};

export const theme: Theme = {
    colors: {
        text: {
            submit: colors.white,
            cancel: colors.white,
            regular: colors.primary,
            button: colors.white
        },
        background: {
            submit: colors.submit,
            cancel: colors.cancel,
            regular: colors.secondary,
            button: colors.black
        },
        circle: {
            regular: {
                textColor: colors.primary,
                pathColor: colors.primary,
                trailColor: colors.secondary
            },
            submit: {
                textColor: colors.primary,
                pathColor: colors.submit,
                trailColor: colors.secondary
            }
        }
    },
    getAppearanceColor: function (appearance: AppearanceNames, element: Elements) {
        return this.colors[element][appearance];
    }
};

export const GlobalStyle = createGlobalStyle`

  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap");

  html {
    overflow: hidden;
  }

  body {
    font-family: 'Montserrat', sans-serif;
    font-weight: 400;
    height: 100vh;
    width: 100vw;
    box-sizing: border-box;
    overflow: hidden;
    margin: 0;
    color: ${colors.primary};
    letter-spacing: 0.8px;

    * {
      box-sizing: inherit;
      font-family: inherit;
    }
  }

  button {
    outline: none;
    background: transparent;
    border: none;
    color: ${colors.primary};
    letter-spacing: inherit;
  }

  #root {
    height: 100%;
    width: 100%;
  }

  h3 {
    font-weight: 400;
  }
`;
