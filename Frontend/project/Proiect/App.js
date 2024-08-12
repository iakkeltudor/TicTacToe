import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, ImageBackground, Image, KeyboardAvoidingView, TextInput, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { retrieveUsers } from './API/API';
import React from 'react';

//import DefaultImage from './goma.jpg';

//const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;

//const image = {uri: DEFAULT_IMAGE};

export default class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      usernames: ""
    };
  }

  butonApasat = () => {

    retrieveUsers().then((response) => response.json()) // Transform the data into json
      // Use text() method to get the plain text content
      
    .then(data => {

        for (var i = 0; i < data.length; i++) {
          this.setState({usernames: this.state.usernames + data[i].username + "\n"});
        }

      })

  };

  render() {
    return (
      
    <View style={styles.container}>
      <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? -70 : 70}
            style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.inner}>
                <Text style={styles.header}>Header</Text>
                <TextInput placeholder="Username" style={styles.textInput} />
                <View style={styles.btnContainer}>
                  <Button title="Submit" onPress={() => null} />
                </View>
              </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>


      
      <Button
        title="Press me"
        onPress={() => this.butonApasat()}

      />


      <Text style={{textAlign: 'center', fontSize: 25}}> 
        {this.state.usernames}
      </Text>

      <StatusBar style="auto" />
    </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    width: "100%",
    height: "100%",
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },

});


