import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { StyleSheet, Text, Touchable, TouchableOpacity, View, Button, TouchableWithoutFeedback, Dimensions, Image, ScrollView } from 'react-native';
import { Video, Audio, AVPlaybackStatus } from 'expo-av';
import { SliderPicker } from 'react-native-slider-picker';
const controlColor = "#222222d4";
import { Entypo } from '@expo/vector-icons';
import HorizontalPicker from '@vseslav/react-native-horizontal-picker';

export default function App() {
  const video = useRef(null)
  const [videoSpeed, setVideoSpeed] = useState(1.0)
  const [videoDuration, setVideoDuration] = useState("");
  const [currentVideoPosition, setCurrentVideoStatus] = useState(0);
  const [sound, setSound] = React.useState();
  const [videoPlayStatus, setVideoPlayStatus] = useState(false);
  const [progress, setProgress] = useState(0);
  const [controllerShow, setControllerShow] = useState(true)
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)
  const videoUrl = "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
  const trackBarWidth = 45;




  const qualityItems = [
    { 0: "1080p", value: 1080 },
    { 1: "720p", value: 720 },
    { 2: "480p", value: 480 },
    { 3: "360p", value: 360 },
    { 4: "240p", value: 240 },
  ];

  const speedItems = [
    { 0: "0.50x", value: 0.50 },
    { 1: "0.75x", value: 0.75 },
    { 2: "Normal", value: 1 },
    { 3: "1.25x", value: 1.25 },
    { 4: "1.50x", value: 1.50 },
    { 5: "2x", value: 2 },
  ];


  const renderQualityItems = (item, index) => (
    <View style={{ width: 120, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.itemText}>
        {item[index]}
      </Text>
    </View>
  );

  const renderSpeedItems = (item, index) => (
    <View style={{ width: 120, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.itemText}>
        {item[index]}
      </Text>
    </View>
  );


  const loadVideoResolution = (val) => {
    console.log(qualityItems[val])
  }

  const changeSpeed = (val) => {
    console.log(speedItems[val].value)
    // video.current.setRateAsync(speedItems[val].value, true)
    sound.setRateAsync(speedItems[val].value, true, Audio.PitchCorrectionQuality.High)
  }

  useEffect(() => {
    if (videoPlayStatus) {
      setTimeout(() => setControllerShow(false), 2000)
    }
  }, [videoPlayStatus])

  async function playSound(position, _sound = sound) {
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


  const trackerBarHandler = (position, playableDuration) => {
    let progress = 0;
    if (playableDuration)
      progress = (position * 100 / playableDuration).toFixed()
    else
      progress = 100;
    setProgress(progress)

  }

  const videoStatusHandler = (status) => {
    setCurrentVideoStatus(status.positionMillis)
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
    setShowSettingsPanel(false)
    setControllerShow(prev => !prev);



    // setTimeout(() => { if (videoPlayStatus) { setControllerShow(false) } }, 2000)

  }
  const getVideoTime = () => {
    var minutes = Math.floor(currentVideoPosition / 60000);
    var seconds = ((currentVideoPosition % 60000) / 1000).toFixed(0);
    var hours = (currentVideoPosition / (1000 * 60 * 60)).toFixed(0);
    //ES6 interpolated literals/template literals 
    //If seconds is less than 10 put a zero in front.
    return `${(hours > 0 ? hours + ':' : "")}${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
  }

  async function skip(bool) {
    const status = await video.current.getStatusAsync();
    const tenSeconds = 10000;
    const curPos = status.positionMillis;
    const newPos = bool ? curPos + tenSeconds : curPos - tenSeconds;
    setPosition(newPos);
    video.current.setPositionAsync(newPos);
  }

  const settingsModalHandler = () => {

    setControllerShow(false)
    setShowSettingsPanel(prev => !prev)

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
            resizeMode={"cover"}
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

        {showSettingsPanel && <View style={styles.settingsModal}>
          <View style={styles.quality}>
            <Text style={{ color: '#FFF', fontWeight: 'bold', margin: 10 }}>Quality</Text>
            <HorizontalPicker
              data={qualityItems}
              renderItem={renderQualityItems}
              itemWidth={120}
              defaultIndex={1}
              onChange={(val) => { loadVideoResolution(val) }}
              snapTimeout={20}
            />
            <View style={{ width: 11, height: 11, borderRadius: 11 / 2, backgroundColor: 'rgb(15, 174, 241)', alignSelf: 'center', marginBottom: 10 }}></View>
          </View>

          <View style={styles.quality}>
            <Text style={{ color: '#FFF', fontWeight: 'bold', margin: 10 }}>Speed</Text>
            <HorizontalPicker
              data={speedItems}
              renderItem={renderSpeedItems}
              defaultIndex={2}
              itemWidth={120}
              onChange={(val) => { changeSpeed(val) }}
              snapTimeout={20}
            />
            <View style={{ width: 11, height: 11, borderRadius: 11 / 2, backgroundColor: 'rgb(15, 174, 241)', alignSelf: 'center', marginBottom: 10 }}></View>
          </View>
        </View>}

        <View style={[styles.controlContainer, { opacity: controllerShow ? 1 : 0, bottom: controllerShow ? 10 : -100, zIndex: controllerShow ? 1 : -9 }]}>

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
                position: 'absolute', top: -25, backgroundColor: '#fff', minWidth: 35, height: 18, justifyContent: 'center',
                left: progress - 10 + '%',
                alignItems: 'center',
                paddingHorizontal: 4
              }}>

                <View style={{
                  position: 'absolute', backgroundColor: '#FFF', bottom: -2, width: 10, height: 10,
                  transform: [{ rotate: '495deg' }]

                }}></View>
                <Text style={{ fontSize: 12 }}>{getVideoTime()}</Text>
              </View>
              <View style={{
                zIndex: -1,
                height: 15,
                width: Dimensions.get('screen').width * trackBarWidth / 100,
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center',
              }}>

                <View style={{ width: progress + '%', height: 100 + '%', backgroundColor: '#03acef' }}></View>
              </View>
            </View>



            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, width: Dimensions.get('screen').width - 130 - (Dimensions.get('screen').width * trackBarWidth / 100), justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={settingsModalHandler}>
                <Image source={require('./settings.png')} style={{ width: 20, height: 20, }} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={require('./expand.png')} style={{ width: 15, height: 15, }} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={require('./vSmall.png')} style={{ width: 20, height: 26, marginTop: -5, marginRight: 5 }} resizeMode={"stretch"} />
              </TouchableOpacity>

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
    bottom: 0,
    width: 95 + '%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  playButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80, height: 55, backgroundColor: controlColor, marginRight: 10, borderRadius: 10
  },
  settingsModal: {
    width: 90 + '%',
    height: 170,
    justifyContent: 'space-between',
    position: 'absolute',
    marginBottom: 20
  },
  quality: {
    backgroundColor: controlColor,
    width: 100 + '%',
    height: 49 + '%'
  },
  itemText: {
    color: '#FFF',
    fontWeight: 'bold'
  }
});
