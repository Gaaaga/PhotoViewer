import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    height: 63,

    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
  },
});

class Header extends React.Component {
  render() {
    const { title, headerLeft, headerRight } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.icon}>{headerLeft}</View>
        <Text style={styles.title}>{title || ''}</Text>
        <View style={styles.icon}>{headerRight}</View>
      </View>
    );
  }
}

export default Header;
