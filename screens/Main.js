import React from 'react';
import {
  Image as RNImage,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { Image, SearchBar, Icon } from 'react-native-elements';

import dataBase from '../dataBase/index_2';
import Header from '../components/Header';
import InfiniteScroll from '../components/InfiniteScroll';
import Layout from '../constants/Layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  searchBar: {
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
});

const prefetchedImages = items =>
  items.map(item => {
    return RNImage.prefetch(item.urls.thumb);
  });
export class Main extends React.Component {
  state = {
    searchMode: false,
    search: '',
  };

  componentDidMount() {
    const urls = dataBase;
    console.log(urls);

    Promise.all(prefetchedImages);
    this.InfiniteScrollRef.addItems(urls);
  }

  setRef = node => {
    this.InfiniteScrollRef = node;
  };

  goDetail = item => () => {
    this.props.navigation.push('Detail', { item });
  };

  renderItem = item => {
    const width = Math.floor(Layout.window.width / 2);
    const height = Math.floor((item.height * width) / item.width);

    return (
      <TouchableOpacity onPress={this.goDetail(item)}>
        <Image
          source={{ uri: item.urls.thumb, cache: 'force-cache' }}
          style={{ height, width, marginBottom: 5 }}
          PlaceholderContent={<ActivityIndicator />}
        />
      </TouchableOpacity>
    );
  };

  updateSearch = search => {
    this.setState({ search });
  };

  keyExtractor = item => item.id;

  enableSearch = () => {
    this.setState({ searchMode: true });
  };

  disableSearch = () => {
    this.setState({ searchMode: false });
  };

  render() {
    const { search, searchMode } = this.state;
    const headerLeft = (
      <Icon
        name="search"
        color="#666"
        size={30}
        containerStyle={{ paddingLeft: 15, paddingTop: 6 }}
        onPress={this.enableSearch}
      />
    );
    const headerRight = (
      <Icon
        name="reorder"
        size={30}
        containerStyle={{ paddingRight: 15, paddingTop: 6 }}
        color="#666"
        onPress={() => {}}
      />
    );
    return (
      <View style={styles.container}>
        {searchMode ? (
          <SearchBar
            containerStyle={styles.searchBar}
            platform="ios"
            placeholder="Type Here..."
            onChangeText={this.updateSearch}
            value={search}
            onCancel={this.disableSearch}
            onClear={this.disableSearch}
          />
        ) : (
          <Header headerLeft={headerLeft} headerRight={headerRight} />
        )}
        <InfiniteScroll
          space={5}
          ref={this.setRef}
          columns={2}
          renderItem={item => this.renderItem(item)}
          keyExtractor={item => this.keyExtractor(item)}
          hasMore={false}
          refresh={false}
        />
        {/* {this.state.list.map((item, index) => { */}
        {/*  return <ResizeImage key={index} sourceUrl={item} />; */}
        {/* })} */}
      </View>
    );
  }
}

Main.navigationOptions = {
  header: null,
};
