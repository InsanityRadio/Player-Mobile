import React from 'react';
import { StyleSheet, Text, Image, View, StatusBar, Animated, Alert } from 'react-native';
import { COLOR, ThemeProvider, Toolbar } from 'react-native-material-ui';

import Container from './Container';
import PlayerControls from './PlayerControls';
import PlayerMeta from './PlayerMeta';
import Video from 'react-native-video';

export default class PlayerMain extends React.Component {

	URL = 'https://stream.cor.insanityradio.com/manifest/hls/video.m3u8'

	state = {
		video: false
	}

	loadVideo () {
		Alert.alert(
			'Warning',
			"Video is only currently available in HD. This won't work unless you're on fast 4G or Wi-Fi. If on 4G, unless you're on an unlimited data plan, this will use a very large chunk of your allowance.",
			[
				{ text: 'Cancel', onPress: () => this.setState({ video: false }), style: 'cancel' },
				{ text: 'Watch', onPress: () => this.setState({ video: true })}
			],
			{ cancelable: true }
		)
	}

	componentWillUpdate (newProps, newState) {
		if (this.props.player && newState.video != this.state.video) {
			newState.video ? this.props.player.stop() : this.props.player.go();
		}
	}

	renderVideo () {

		return (
			<Animated.View>
				<Video
					style={{ height: 400 }}
					source={{ uri: this.URL }}
					ref={ (a) => this.video = a }
					playInBackground={ false }
					resizeMode="contain"
					playWhenInactive={ true }
					onBuffer={ (a) => console.warn('onBuffer', a) }
					onError={ (a) => console.warn('onError', a) }
					onLoadStart={ (a) => console.warn('onLoadStart', a) }
					onEnd={ (a) => console.warn('onEnd', a) } />
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
