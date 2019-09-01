import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import Modal from 'react-native-modal';
import { inject, observer } from 'mobx-react';
import { ORDERTYPEP } from '../store';

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
  title: {
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 6,
  },
});
@inject('store')
@observer
export class FilterModal extends React.Component {
  state = {
    cameraMake: [],
    cameraModel: [],
    orderType: ORDERTYPEP.VA,
  };

  applyFilter = () => {
    const { store } = this.props;
    const { cameraMake, cameraModel, orderType } = this.state;
    store.applyFilter(cameraMake, cameraModel, orderType);
    this.props.toggleModal();
  };

  toggleCameraMake = item => {
    const { cameraMake } = this.state;
    if (cameraMake.includes(item)) {
      this.setState({
        cameraMake: cameraMake.filter(listItem => listItem !== item),
      });
    } else {
      this.setState({
        cameraMake: [...cameraMake, item],
      });
    }
  };

  toggleCameraModel = item => {
    const { cameraModel } = this.state;
    if (cameraModel.includes(item)) {
      this.setState({
        cameraModel: cameraModel.filter(listItem => listItem !== item),
      });
    } else {
      this.setState({
        cameraModel: [...cameraModel, item],
      });
    }
  };

  setOrder = type => {
    this.setState({ orderType: type });
  };

  render() {
    const { cameraMake, cameraModel, orderType } = this.state;
    const cameraMakeList = ['Apple', 'Google', 'samsung'];
    const cameraModelList = [
      'iPhone 6s',
      'iPhone X',
      'iPhone Xs',
      'Pixel XL',
      'Galaxy S10',
    ];
    return (
      <Modal
        isVisible={this.props.isModalVisible}
        onBackdropPress={this.props.toggleModal}
        onBackButtonPress={this.props.toggleModal}
        animationIn="fadeIn"
        animationInTiming={100}
        animationOut="fadeOut"
        animationOutTiming={100}
        backdropTransitionOutTiming={100}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#FFF',
            borderRadius: 8,
          }}
        >
          <ScrollView
            style={{
              paddingHorizontal: 70,
              height: 500,
              width: '100%',
              marginBottom: 30,
            }}
          >
            <Text style={styles.title}>Camera Make</Text>
            <View>
              {cameraMakeList.map((item, index) => (
                <CheckBox
                  containerStyle={{ padding: 8 }}
                  size={10}
                  key={index}
                  title={item}
                  checked={cameraMake.includes(item)}
                  onPress={() => this.toggleCameraMake(item)}
                />
              ))}
            </View>

            <Text style={styles.title}>Camera Model</Text>

            {cameraModelList.map((item, index) => (
              <CheckBox
                containerStyle={{ padding: 8 }}
                size={10}
                key={index}
                title={item}
                checked={cameraModel.includes(item)}
                onPress={() => this.toggleCameraModel(item)}
              />
            ))}

            <Text style={styles.title}>Views</Text>
            <CheckBox
              containerStyle={{ padding: 8 }}
              size={10}
              title="Ascending"
              checked={orderType === ORDERTYPEP.VA}
              onPress={() => this.setOrder(ORDERTYPEP.VA)}
            />
            <CheckBox
              containerStyle={{ padding: 8 }}
              size={10}
              title="Descending"
              checked={orderType === ORDERTYPEP.VD}
              onPress={() => this.setOrder(ORDERTYPEP.VD)}
            />
            <Text style={styles.title}>Downloads</Text>
            <CheckBox
              containerStyle={{ padding: 8 }}
              size={10}
              title="Ascending"
              checked={orderType === ORDERTYPEP.DA}
              onPress={() => this.setOrder(ORDERTYPEP.DA)}
            />
            <CheckBox
              containerStyle={{ padding: 8 }}
              size={10}
              title="Descending"
              checked={orderType === ORDERTYPEP.DD}
              onPress={() => this.setOrder(ORDERTYPEP.DD)}
            />
          </ScrollView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              margin: 5,
            }}
          >
            <Button
              type="outline"
              onPress={this.props.toggleModal}
              title="Cancel"
            />
            <Button onPress={this.applyFilter} title="Apply" />
          </View>
        </View>
      </Modal>
    );
  }
}
