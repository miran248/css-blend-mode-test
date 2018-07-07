import React, { Component } from "react";
import styled, { css } from "styled-components";
import Vibrant from "node-vibrant";
import Color from "color";

const images = [
  "sunset-1899043_1920.jpg", // https://pixabay.com/en/sunset-sky-afterglow-twilight-1899043/
  "janets-foss-2451389_1920.jpg", // https://pixabay.com/en/janet-s-foss-malham-yorkshire-2451389/
  "desert-1654439_1920.jpg", // https://pixabay.com/en/desert-dunes-algodones-dunes-1654439/
  "tree-1056598_1920.jpg", // https://pixabay.com/en/tree-snow-winter-landscape-1056598/
  "winter-landscape-2571788_1920.jpg", // https://pixabay.com/en/winter-landscape-trees-snow-nature-2571788/
  "yellowstone-national-park-1581879_1920.jpg", // https://pixabay.com/en/yellowstone-national-park-wyoming-1581879/
];

const Base = styled.div`
  &:before {
    content: "";

    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }

  position: relative;

  flex: 1;

  display: flex;

  flex-direction: column;

  & > * {
    position: relative;
  }
`;

const Container = styled(Base)`
  &:before {
    ${({ image }) => typeof image !== "undefined" && css`
      background-image: url(${image});
      background-attachment: fixed;
      background-size: cover;
      background-position: center;
      backface-visibility: hidden;
    `}

    ${({ background, grayscale }) => typeof background !== "undefined" && css`
      background-color: ${background};

      background-blend-mode: soft-light;

      ${grayscale
        ? css`
        filter: contrast(75%) grayscale(50%);
      ` : css`
        filter: contrast(75%);
      `};
    `}

    ${({ radius }) => typeof radius !== "undefined" && css`
      border-radius: ${radius};
      overflow: hidden;
    `}

    ${({ border }) => typeof border !== "undefined" && css`
      border: .2vmin solid ${border};
    `}

    ${({ shadow }) => typeof shadow !== "undefined" && css`
      box-shadow: 0 0 1vmin 0 ${shadow};
    `}
  }
`;

const Padded = styled(Container)`
  padding: 16vmin;

  ${({ color }) => typeof color !== "undefined" && css`
    color: ${color};
  `}
`;

const Horizontal = styled(Container)`
  flex-direction: row;
`;

const Vertical = styled.div`
  flex: 1;

  display: flex;

  flex-direction: column;

  overflow-y: auto;

  & > div {
    height: 66vmin;

    margin-top: 1vmin;

    flex: none;
  }
`;

const Pages = styled.div`
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  width: 1vmin;

  padding-left: 1vmin;
`;

const Page = styled.div`
  flex: 0 0 4vmin;

  width: 1vmin;

  border-radius: 1vmin;

  overflow: hidden;

  margin-top: 1vmin;

  ${({ active }) => css`
    background-color: ${active ? "#CCCCCC" : "#333333"};
  `}
`;

const Sidebar = styled(Container)`
  &:before {
    left: .2vmin;
    top: .2vmin;
    bottom: .2vmin;
  }

  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  flex: 5;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;
`;

const Header = styled.header`
  display: flex;

  flex-direction: row;

  align-items: center;
`;

const H1 = styled.h1`
  margin: 0;

  padding-left: 2vw;
  padding-right: 1.9vw;

  line-height: 4.8vw;

  font-size: 2.4vw;
  font-weight: normal;
`;

const H2 = styled.h2`
  margin: 0;

  padding-left: 2.0vw;
  padding-right: 2.0vw;

  border-left: .1vmin solid #CDCDCD;

  line-height: 4.8vw;

  font-size: 1.4vw;
  font-weight: normal;

  color: #333333;

  ${({ color }) => typeof color !== "undefined" && css`
    color: ${color};
  `}
`;

const P = styled.p`
  font-size: 1.2vw;

  text-align: center;
`;

class Photo extends Component {
  state = {

  };

  constructor(props) {
    super();

    const { image } = props;

    const v = new Vibrant(image, {
      colorCount: 256,
      quality: 1
    });

    v.getPalette().then(
      (palette) => {
        // console.log(palette);

        const vibrant = new Color(palette.Vibrant.getHex());
        const dark = palette.DarkVibrant ? new Color(palette.DarkVibrant.getHex()) : vibrant;
        const light = palette.LightVibrant ? new Color(palette.LightVibrant.getHex()) : vibrant;

        const background = dark.alpha(.75);
        const border = light.alpha(.5);
        const shadow = dark // .alpha(.5);
        const sidebar = vibrant.alpha(.9);

        const text = light.isLight() ? light.mix(new Color("#000000"), .8) : light.isDark() ? light.mix(new Color("#FFFFFF"), .8) : light;
        const lighterText = light.isLight() ? light.mix(new Color("#000000"), .7) : light.isDark() ? light.mix(new Color("#FFFFFF"), .7) : light;

        this.setState(
          () => ({
            background: background.toString(),
            border: border.toString(),
            shadow: shadow.toString(),
            sidebar: sidebar.toString(),

            color: lighterText.toString(),
            mainColor: text.toString(),
          })
        );
      }
    );
  }

  render() {
    const { image, index } = this.props;
    const { state } = this;

    return (
      <Padded image={image} grayscale="true" radius=".4vmin" background={state.background} color={state.mainColor}>
        <Horizontal image={image} radius=".2vmin" border={state.border} shadow={state.shadow}>
          <Sidebar image={image} background={state.sidebar}>
            <P>Lorem ipsum dolor sit amet</P>
          </Sidebar>

          <Content>
            <Header>
              <H1>{index}</H1>

              <H2 color={state.color}>{image}</H2>
            </Header>
          </Content>
        </Horizontal>
      </Padded>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Horizontal>
        <Vertical>
          {images.map(
            (image, i) => (
              <Photo key={image} image={image} index={i} />
            )
          )}
        </Vertical>

        <Pages>
          {images.map(
            (image, i) => (
              <Page key={image} active={i === 2} />
            )
          )}
        </Pages>
      </Horizontal>
    );
  }
}

export default App;
