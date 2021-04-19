import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { StyleSheet, Text, Touchable, TouchableOpacity, View, Button, TouchableWithoutFeedback, Dimensions, Image } from 'react-native';
import { Video, Audio, AVPlaybackStatus } from 'expo-av';
import { SliderPicker } from 'react-native-slider-picker';
const controlColor = "#222222d4";
import { Entypo } from '@expo/vector-icons';

export default function App() {
  const video = useRef(null)
  const [videoSpeed, setVideoSpeed] = useState(1.0)
  const [videoDuration, setVideoDuration] = useState("")
  const [sound, setSound] = React.useState();
  const [videoPlayStatus, setVideoPlayStatus] = useState(false);
  const [progress, setProgress] = useState(0);
  const [controllerShow, setControllerShow] = useState(true)
  const videoUrl = "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
  const trackBarWidth = 45;


  useEffect(() => {
    if (videoPlayStatus) {
      setTimeout(() => setControllerShow(false), 2000)
    }
  }, [videoPlayStatus])

  async function playSound(position, _sound = sound) {
    console.log(_sound)
    // sound.setRateAsync(1.5, true, Audio.PitchCorrectionQuality.High)
    // console.log('Playing Sound');
    _sound.setPositionAsync(position)
    await _sound.playAsync();
  }

  async function stopSound(position) {

    // sound.setRateAsync(1.5, true, Audio.PitchCorrectionQuality.High)
    // console.log('Playing Sound');
    await sound.pauseAsync();
  }
  const CustomThumb = () => (
    <View style={componentThumbStyles.container}>
    </View>
  );

  const trackerBarHandler = (position, playableDuration) => {
    let progress = 0;
    if (playableDuration)
      progress = (position * 100 / playableDuration).toFixed()
    else
      progress = 100;
    setProgress(progress)

  }

  const videoStatusHandler = (status) => {
    trackerBarHandler(status.positionMillis, status.playableDurationMillis)
    const isPlaying = status.isPlaying
    // console.log(status)
    if (isPlaying != videoPlayStatus) { // optimization
      if (isPlaying) {
        playSound(status.positionMillis);
      }
      else {
        stopSound(status.positionMillis);
      }
    }

    setVideoPlayStatus(isPlaying);
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


  const goToPosition = async (percent, position, videoDuration, sound) => {
    await video.current.setPositionAsync(position);
    video.current.playAsync()
    playSound(position, sound);
    // trackerBarHandler(position, videoDuration);

  }
  const playButtonHandler = () => {
    if (!videoPlayStatus) {
      video.current.playAsync();
    }
    else {
      video.current.pauseAsync();
    }
  }

  // React.useEffect(() => {
  //   return sound
  //     ? () => {
  //       console.log('Unloading Sound');
  //       sound.unloadAsync();
  //     }
  //     : undefined;
  // }, [sound]);


  const controlShowHandler = () => {

    setControllerShow(prev => !prev);



    // setTimeout(() => { if (videoPlayStatus) { setControllerShow(false) } }, 2000)

  }

  return (
    <View style={styles.container}>

      <StatusBar style="auto" />
      <View style={styles.videContainer}>
        <TouchableWithoutFeedback onPress={() => controlShowHandler()}>
          <Video
            onLoad={(log) => { setVideoDuration(log.durationMillis) }}
            ref={video}
            style={{ width: Dimensions.get('screen').width, height: 300 }}
            source={{
              uri: videoUrl,
            }}
            rate={videoSpeed}
            shouldPlay={false}
            volume={1.0}
            isMuted={true}
            useNativeControls={false}
            ref={video}
            // isLooping
            onPlaybackStatusUpdate={videoStatusHandler}
          />
        </TouchableWithoutFeedback>

        <View style={[styles.controlContainer, { opacity: controllerShow ? 1 : 0, bottom: controllerShow ? 50 : -100, zIndex: controllerShow ? 1 : -9 }]}>

          <TouchableOpacity style={styles.playButton} onPress={() => playButtonHandler()}>
            <Entypo name={`controller-${!videoPlayStatus ? 'play' : 'paus'}`} size={43} color="#FFF" />

          </TouchableOpacity>

          <View style={styles.trackContainer}>

            {/* <TouchableOpacity onPress={() => video.current.playAsync()}><Text>Play</Text></TouchableOpacity> */}



            <View style={styles.trackBar}>
              <SliderPicker
                maxValue={100}
                videoDuration={videoDuration}
                callback={goToPosition}
                defaultValue={progress}
                sound={sound}
                labelFontColor={"#6c7682"}
                labelFontWeight={'600'}
                showFill={true}
                fillColor={'#03acef'}
                labelFontWeight={'bold'}
                showNumberScale={false}
                showSeparatorScale={false}
                buttonBackgroundColor={'transparent'}
                buttonBorderColor={"transparent"}
                buttonBorderWidth={0}
                scaleNumberFontWeight={'300'}
                buttonDimensionsPercentage={0}
                heightPercentage={2}
                widthPercentage={trackBarWidth}
              />
              <View style={{
                zIndex: -1,
                height: 15,
                width: Dimensions.get('screen').width * trackBarWidth / 100,
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center',
              }}>
                <View style={{ width: progress + '%', height: 100 + '%', backgroundColor: '#03acef' }}></View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, width: Dimensions.get('screen').width - 130 - (Dimensions.get('screen').width * trackBarWidth / 100), justifyContent: 'space-evenly' }}>
              <Image source={require('./settings.png')} style={{ width: 20, height: 20, }} />
              <Image source={require('./expand.png')} style={{ width: 15, height: 15, }} />
              <Image source={require('./vSmall.png')} style={{ width: 20, height: 26, marginTop: -5 }} resizeMode={"stretch"} />

            </View>
          </View >


        </View>




      </View>
    </View >

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
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBar: {
  },
  videContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackContainer: {
    width: Dimensions.get('screen').width - 110,
    borderRadius: 3,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 13,
    backgroundColor: controlColor,
    height: 40
  },
  controlContainer: {
    position: 'absolute',
    bottom: 50,
    width: 95 + '%',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  playButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80, height: 60, backgroundColor: controlColor, marginRight: 10, borderRadius: 10
  }
});
