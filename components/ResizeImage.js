import React, { PureComponent } from 'react';
import { Image } from 'react-native';
import Layout from '../constants/Layout';

export class ResizeImage extends PureComponent {
  static defaultProps = {
    style: undefined,
    source: undefined,
    resizeMode: 'contain',
    sourceUrl: undefined,
    sourceDefault: undefined,
    sourcePlaceholder: undefined,
  };

  constructor(props) {
    super(props);
    console.log(props)
    this.size = {
      width: props.width || Math.floor(Layout.window.width),
      height: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.sourceUrl) {
      this.lazyLoadImage(nextProps.sourceUrl);
    }
  }

  componentDidMount() {
    this.lazyLoadImage(this.props.sourceUrl);
  }

  lazyLoadImage(imageUrl) {
    Image.getSize(
      imageUrl,
      (width, height) => {
        this.size.height = Math.floor((height / width) * this.size.width);
        if (width > 0 && height > 0) {
          this.source = { url: imageUrl };
          this.forceUpdate();
        }
      },
      () => {
        this.source = {
          uri: '../assets/images/icon.png',
        };
        this.forceUpdate();
      },
    );
  }

  render() {
    const {
      width,
      resizeMode,
      style,
      source,
      sourcePlaceholder,
      addBackground,
      backgroundInset,
      backgroundColor,
      backgroundRadius,
      ...others
    } = this.props;

    const imageSize = this.size;

    return (
      <Image
        style={[imageSize, style]}
        resizeMode={resizeMode}
        source={this.source || source || sourcePlaceholder}
        {...others}
      />
    );
  }
}
