import React from 'react';
import {
  ActivityIndicator,
  Image as RNImage,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { SearchBar, Icon, Image } from 'react-native-elements';
import dataBase from '../dataBase/index.json';

import { FilterModal } from '../components/FilterModal';
import Header from '../components/Header';
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

@inject('store')
@observer
class Main extends React.Component {
  state = {
    searchMode: false,
    isModalVisible: false,
  };

  async componentDidMount() {
    const { store } = this.props;
    store.initData(dataBase);
    Promise.all(prefetchedImages).then(res => {
      console.log(res);
      console.log(dataBase[0].urls.thumb);
      Promise.all([RNImage.queryCache([dataBase[0].urls.thumb])]).then(res => {
        console.log(res);
      });
    });
  }

  setRef = node => {
    this.InfiniteScrollRef = node;
  };

  goDetail = item => () => {
    this.props.navigation.push('Detail', { item });
  };

  updateSearch = search => {
    this.props.store.updateSearch(search);
  };

  toggleSearch = () => {
    this.setState({ searchMode: !this.state.searchMode });
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  render() {
    const { store } = this.props;
    const { search, sortedList } = store;
    const { searchMode } = this.state;

    const renderCol = [{ data: [], height: 0 }, { data: [], height: 0 }];
    sortedList.forEach(item => {
      const resizeItem = { ...item };
      const width = Math.floor(Layout.window.width / 2) - 15;
      const height = Math.floor((item.height / item.width) * width);
      resizeItem.width = width;
      resizeItem.height = height;
      if (renderCol[0].height <= renderCol[1].height) {
        renderCol[0].data.push(resizeItem);
        renderCol[0].height += resizeItem.height;
      } else {
        renderCol[1].data.push(resizeItem);
        renderCol[1].height += resizeItem.height;
      }
    });
    const headerLeft = (
      <Icon
        name="search"
        color="#666"
        size={30}
        containerStyle={{ paddingLeft: 15, paddingTop: 6 }}
        onPress={this.toggleSearch}
      />
    );
    const headerRight = (
      <Icon
        name="reorder"
        size={30}
        containerStyle={{ paddingRight: 15, paddingTop: 6 }}
        color="#666"
        onPress={this.toggleModal}
      />
    );
    const DisplayImage = (item, index) => (
      <TouchableOpacity key={index} onPress={this.goDetail(item)}>
        <Image
          style={{
            marginBottom: 10,
            width: item.width,
            height: item.height,
          }}
          source={{ uri: item.urls.thumb }}
          PlaceholderContent={<ActivityIndicator />}
        />
      </TouchableOpacity>
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
            onCancel={this.toggleSearch}
            onClear={this.toggleSearch}
          />
        ) : (
          <Header headerLeft={headerLeft} headerRight={headerRight} />
        )}
        <ScrollView>
          <View
            style={{
              paddingHorizontal: 10,
              flex: 1,
              width: Math.floor(Layout.window.width),
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View>
              {renderCol[0].data.map((item, index) =>
                DisplayImage(item, index),
              )}
            </View>
            <View>
              {renderCol[1].data.map((item, index) =>
                DisplayImage(item, index),
              )}
            </View>
          </View>
        </ScrollView>
        <FilterModal
          isModalVisible={this.state.isModalVisible}
          toggleModal={this.toggleModal}
        />
      </View>
    );
  }
}

Main.navigationOptions = {
  header: null,
};

export default Main;
