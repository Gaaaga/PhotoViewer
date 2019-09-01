import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  CameraRoll,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Platform,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import { Button, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import moment from 'moment';
import { ResizeImage } from '../components/ResizeImage';
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

  download = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    console.log(status);
    if (status === 'granted') {
      const item = this.props.navigation.getParam('item');
      this.setState({ downloadStatus: 'Downloading' });
      if (Platform.OS === 'android') {
        FileSystem.downloadAsync(
          item.urls.thumb,
          `${FileSystem.documentDirectory}${item.id}.jpg`,
        )
          .then(({ uri }) => {
            console.log('Finished downloading to ', uri);
            this.saveImage(uri);
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        this.saveImage(item.urls.regular);
      }
    }
  };

  saveImage = url => {
    CameraRoll.saveToCameraRoll(url, 'photo')
      .then(res => {
        console.log(res);
        this.setState({ downloadStatus: 'Download succeed' });
        setTimeout(() => {
          this.setState({ downloadStatus: '' });
        }, 1000);
      })
      .catch(err => {
        console.log(err);
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
                    width: Math.floor(Layout.window.width) - 50,
                    height: 300,
                  }}
                  source={{ uri: item.urls.regular }}
                  resizeMode="contain"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.infoContianer}>
            <Text style={styles.title}>User:</Text>
            <Text>{item.user.name || ' - '}</Text>
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
          {Platform.OS === 'ios' ? (
            <ResizeImage
              width={Math.floor(Layout.window.width) - 80}
              sourceUrl={item.urls.regular}
            />
          ) : (
            <View
              style={{
                width: Math.floor(Layout.window.width),
                height: 500,
                backgroundColor: '#fff',
                alignItems: 'center',
              }}
            >
              <Image
                style={{
                  width: Math.floor(Layout.window.width) - 80,
                  height: 500,
                }}
                source={{ uri: item.urls.regular }}
              />
            </View>
          )}
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
