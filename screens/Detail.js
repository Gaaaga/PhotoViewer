import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  CameraRoll,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import moment from 'moment';
import { ResizeImage } from '../components/ResizeImage';
import { Main } from './Main';
import Header from '../components/Header';
import Layout from '../constants/Layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  infoContianer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    paddingVertical: 6,
  },
});

export class Detail extends React.Component {
  state = {
    isModalVisible: false,
    downloadStatus: '',
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  download = () => {
    const item = this.props.navigation.getParam('item');
    this.setState({ downloadStatus: 'Downloading' });
    CameraRoll.saveToCameraRoll(item.urls.regular, 'photo')
      .then(res => {
        console.log(res);
        this.setState({ downloadStatus: 'Download succeed' });
        setTimeout(() => {
          this.setState({ downloadStatus: '' });
        }, 1000);
      })
      .catch(() => {
        this.setState({ downloadStatus: 'Download failed' });
        setTimeout(() => {
          this.setState({ downloadStatus: '' });
        }, 1000);
      });
  };

  render() {
    const item = this.props.navigation.getParam('item');
    const headerLeft = (
      <Icon
        name="arrow-back"
        color="#666"
        size={30}
        containerStyle={{ paddingLeft: 15, paddingTop: 6 }}
        onPress={() => {
          this.props.navigation.pop();
        }}
      />
    );
    return (
      <View style={styles.container}>
        <Header headerLeft={headerLeft} />
        <ScrollView>
          <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
            <TouchableWithoutFeedback onPress={this.toggleModal}>
              <View style={{ alignItems: 'center' }}>
                <Image
                  style={{
                    width: Layout.window.width - 50,
                    height: 300,
                  }}
                  source={{ uri: item.urls.regular }}
                  resizeMode="contain"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.infoContianer}>
            <Text style={styles.title}>Description:</Text>
            <Text>{item.alt_description || ' - '}</Text>
            <Text style={styles.title}>Location:</Text>
            <Text>{item.location.title || ' - '}</Text>
            <Text style={styles.title}>Info:</Text>
            <Text>
              Published on
              {moment(item.created_at).format('MMM Do YYYY') || ' - '}
            </Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View>
                <Text style={styles.title}>Views:</Text>
                <Text>{item.views || ' - '}</Text>
              </View>
              <View>
                <Text style={styles.title}>Downloads:</Text>
                <Text>{item.downloads || ' - '}</Text>
              </View>
            </View>
            <Text style={styles.title}>Camera Make:</Text>
            <Text>{item.exif.make || ' - '}</Text>
            <Text style={styles.title}>Camera Model:</Text>
            <Text>{item.exif.model || ' - '}</Text>
          </View>
        </ScrollView>

        <Modal
          style={{
            paddingTop: 40,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
          isVisible={this.state.isModalVisible}
          onBackdropPress={this.toggleModal}
          onBackButtonPress={this.toggleModal}
          animationIn="fadeIn"
          animationInTiming={100}
          animationOut="fadeOut"
          animationOutTiming={100}
          backdropTransitionOutTiming={100}
        >
          <ResizeImage
            width={Math.floor(Layout.window.width) - 80}
            sourceUrl={item.urls.regular}
          />
          <View
            style={{ position: 'absolute', bottom: 0, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', paddingVertical: 10 }}>
              {this.state.downloadStatus}
            </Text>

            <Button
              onPress={this.download}
              buttonStyle={{ backgroundColor: '#fff', paddingHorizontal: 20 }}
              titleStyle={{ color: '#333' }}
              title="download"
            />
          </View>
        </Modal>
      </View>
    );
  }
}

Detail.navigationOptions = {
  header: null,
};
