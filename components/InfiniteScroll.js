import React from 'react';
import { FlatList, ScrollView, View, RefreshControl, Text } from 'react-native';

class Column extends React.Component {
  state = {
    height: 0,
    data: [],
  };

  getHeight = () => {
    return this.state.height;
  };

  addItems = items => {
    this.setState({ data: [...this.state.data, ...items] });
  };

  renderItem = ({ item }) => {
    return (
      <View
        onLayout={event => {
          const { height } = event.nativeEvent.layout;
          this.setState({ height: this.getHeight() + height });
          item.onLayout && item.onLayout();
        }}
      >
        {this.props.renderItem(item)}
      </View>
    );
  };

  render() {
    return (
      <View
        style={{ flex: 1, overflow: 'hidden', paddingLeft: this.props.space }}
      >
        <FlatList
          style={{ flex: 1 }}
          data={this.state.data}
          keyExtractor={this.props.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

class LoadMore extends React.Component {
  render() {
    return (
      <View
        style={{ justifyContent: 'center', alignItems: 'center', height: 50 }}
      >
        {this.props.loading ? <Text>Loading...</Text> : <Text>Load More</Text>}
      </View>
    );
  }
}

export default class InfiniteScroll extends React.Component {
  static defaultProps = {
    columns: 2,
    space: 10,
    refresh: true,
    infinite: true,
    refreshing: () => {},
    infiniting: () => {},
    hasMore: true,
    refreshConf: {
      title: 'Drag to Refresh',
      colors: ['#ff0000', '#00ff00', '#3ad564', '#0000ff'],
    },
  };

  constructor(props) {
    super(props);
    const columns = [];
    for (let i = 0; i < props.columns; i += 1) {
      columns.push(null);
    }
    this.state = {
      columns,
      refreshing: false,
      infiniting: false,
    };
    this.itemQueue = [];
  }


  addItems = items => {
    if (items) {
      if (this.itemQueue.length > 0) {
        this.itemQueue = this.itemQueue.concat(items);
      } else {
        this.itemQueue = this.itemQueue.concat(items);
        this.addItems();
      }
    } else if (this.itemQueue.length > 0) {
      const item = this.itemQueue.shift();
      this.addItem(item, () => this.addItems());
    }
  };

  addItemsWithHeight = items => {
    const columns = this.sortColumns().map(col => {
      return {
        column: col,
        height: col.getHeight(),
        data: [],
      };
    });

    // distribute item to the min height column
    items.forEach(item => {
      const col = columns.sort((a, b) => a.height - b.height)[0];
      col.data.push(item);
      col.height += item.height;
    });

    // batch distribute
    columns.forEach(col => {
      col.column.addItems(col.data);
    });
  };

  sortColumns() {
    return this.state.columns.sort((a, b) => a.getHeight() - b.getHeight());
  }

  addItem(item, callback) {
    const minCol = this.sortColumns()[0];
    item.onLayout = callback;
    minCol.addItems([item]);
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.refreshing(this.refreshDone);
  };

  /**
   * on infinite scroll
   * @param event
   * @private
   */
  onInfinite = event => {
    if (this.props.hasMore && this.state.infiniting) return;
    const { y } = event.nativeEvent.contentOffset;
    const { height } = event.nativeEvent.layoutMeasurement;
    const contentHeight = event.nativeEvent.contentSize.height;
    if (y + height >= contentHeight - 20) {
      this.setState({
        infiniting: true,
      });
      this.props.infiniting(this.infiniteDone);
    }
  };

  /**
   * @private
   */
  refreshDone = () => {
    this.setState({
      refreshing: false,
    });
  };

  /**
   * @private
   */
  infiniteDone = () => {
    this.setState({
      infiniting: false,
    });
  };

  render() {
    const loadMore = this.props.infinite ? (
      <LoadMore loading={this.state.infiniting} />
    ) : null;

    return (
      <ScrollView
        refreshControl={
          this.props.refresh ? (
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              {...this.props.refreshConf}
            />
          ) : null
        }
        onScroll={this.props.infinite ? this.onInfinite : null}
        scrollEventThrottle={100}
      >
        <View style={[{ flexDirection: 'row' }, this.props.containerStyle]}>
          {this.state.columns.map((col, index) => {
            return (
              <Column
                key={index}
                space={index === 0 ? 0 : this.props.space}
                ref={ref => (this.state.columns[index] = ref)}
                keyExtractor={this.props.keyExtractor}
                renderItem={this.props.renderItem}
              />
            );
          })}
        </View>
        {this.props.hasMore ? loadMore : null}
      </ScrollView>
    );
  }
}
