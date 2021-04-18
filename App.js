import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { StyleSheet, Text, Touchable, TouchableOpacity, View, Button } from 'react-native';
import { Video, Audio, AVPlaybackStatus } from 'expo-av';
export default function App() {
  const video = useRef(null)
  const [videoSpeed, setVideoSpeed] = useState(1.0)
  const [sound, setSound] = React.useState();
  const [currentVideoStatus, setCurrentVideoStatus] = useState(false);
  const videoUrl = "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
  async function playSound(position) {

    // sound.setRateAsync(1.5, true, Audio.PitchCorrectionQuality.High)
    // console.log('Playing Sound');
    sound.setPositionAsync(position)
    await sound.playAsync();
  }

  async function stopSound(position) {

    // sound.setRateAsync(1.5, true, Audio.PitchCorrectionQuality.High)
    // console.log('Playing Sound');
    await sound.pauseAsync();
  }


  const videoStatusHandler = (status) => {
    // console.log(status.positionMillis);
    const isPlaying = status.isPlaying

    if (isPlaying != currentVideoStatus) { // optimization
      if (isPlaying) {
        playSound(status.positionMillis);
      }
      else {
        stopSound(status.positionMillis);
      }
    }

    setCurrentVideoStatus(isPlaying);
  }


  const loadAudio = async () => {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      { uri: videoUrl }
    );
    setSound(sound);

  }
  useEffect(() => {
    loadAudio();
  }, [])

  // React.useEffect(() => {
  //   return sound
  //     ? () => {
  //       console.log('Unloading Sound');
  //       sound.unloadAsync();
  //     }
  //     : undefined;
  // }, [sound]);


  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />

      <Video
        ref={video}
        style={{ width: 300, height: 200 }}
        source={{
          uri: videoUrl,
        }}
        rate={videoSpeed}
        shouldPlay={false}
        volume={1.0}
        isMuted={true}
        useNativeControls
        ref={video}
        // isLooping
        onPlaybackStatusUpdate={videoStatusHandler}
      />
      <TouchableOpacity onPress={() => setVideoSpeed(1.25)}><Text>Değiştir</Text></TouchableOpacity>
    </View>
  );





  // return (
  //   <View style={styles.container}>
  //     <Button title="Play Sound" onPress={playSound} />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
