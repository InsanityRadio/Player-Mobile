import React from 'react';
import { StyleSheet, Text, Image, View, StatusBar, Animated, Alert } from 'react-native';
import { COLOR, ThemeProvider, Toolbar } from 'react-native-material-ui';

import Container from './Container';
import PlayerControls from './PlayerControls';
import PlayerMeta from './PlayerMeta';
import VideoPlayer from 'react-native-video-controls';

export default class PlayerMain extends React.Component {

	state = {
		video: false
	}

	loadVideo () {
		Alert.alert(
			'Warning',
			"Video is only currently available in HD. This won't work unless you're on fast 4G or Wi-Fi. If on 4G, unless you're on an unlimited data plan, this will use a very large chunk of your allowance.",
			[
				{ text: 'Cancel', onPress: () => this.stopVideo(), style: 'cancel' },
				{ text: 'Watch', onPress: () => this.setState({ video: true })}
			],
			{ cancelable: true }
		)
	}

	stopVideo () {
		this.setState({ video: false });
	}

	componentWillUpdate (newProps, newState) {

		let autoplay = true;

		if (this.props.player && newState.video != this.state.video) {
			newState.video ? this.props.player.stop() : (autoplay && this.props.player.go());
		}

	}

	renderVideo () {

		return (
			<Animated.View style={{ height: 400 }}>
				<VideoPlayer
					videoStyle={{ height: 400 }}
					style={{ height: 400 }}
					source={{ uri: this.URL }}
					poster="https://insanityradio.com/res/slate.png"
					ref={ (a) => this.video = a }
					playInBackground={ false }
					resizeMode="contain"
					playWhenInactive={ true }
					onBuffer={ (a) => false && console.warn('onBuffer', a) }
					onError={ (a) => false && console.warn('onError', a) }
					onLoadStart={ (a) => false && console.warn('onLoadStart', a) }
					onBack={ (a) => this.stopVideo() }
					onEnd={ (a) => false && console.warn('onEnd', a) } />
				<Text></Text>
			</Animated.View>
		)

	}

	render () {

		if (this.state.video) {
			return this.renderVideo();
		}

		return (
			<Animated.View>
				<PlayerControls
					style={ this.props.styles.controls }
					loadVideo={ this.loadVideo.bind(this) }
					{ ...this.props } />
				<PlayerMeta { ...this.props } />
			</Animated.View>
		);
	}

}
