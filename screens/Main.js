import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import dataBase from '../dataBase/index1';

import Layout from '../constants/Layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },

});


export class Main extends React.Component {
  state = {
    searchMode: false,
    search: '',
  };

  componentDidMount() {
    const urls = dataBase;
    console.log(urls);

  }


  render(){
    return(<View></View>)
  }
}

Main.navigationOptions = {
  header: null,
};
