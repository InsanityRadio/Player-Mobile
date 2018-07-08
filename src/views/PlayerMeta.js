import React from 'react';
import { Animated, StyleSheet, Text, Image, ImageBackground, View, StatusBar } from 'react-native';
import { COLOR, ThemeProvider, Toolbar, ActionButton } from 'react-native-material-ui';

import FontAwesome, { Icons } from 'react-native-fontawesome';

import Container from './Container';
import MusicControl from 'react-native-music-control';

class PlayerMetaBackend {
	constructor (url) {
		this.url = url;
	}
	destroy () {

	}
}

class WebSocketPlayerMetaBackend extends PlayerMetaBackend {

	closing = false;

	constructor (url) {
		super(url);
		this.connect();
	}

	connect () {

		this.ws = new WebSocket(this.url);

		this.ws.onopen = (a) => {
		}
		this.ws.onmessage = (data) => {
			data = JSON.parse(data.data)
			this.emit(data);
		}
		this.ws.onclose = () => {
			this.closing || setTimeout(this.connect.bind(this), 100);
		}
		this.ws.onerror = (e) => {
			this.closing || setTimeout(this.connect.bind(this), 100);
		}

	}

	emit (data) {
		this.onData(data);
	}

	destroy () {
		this.closing = true;
		this.close();
	}

	close () {
		this.ws.close();
	}

}

export default class PlayerMeta extends React.Component {

	URL = "https://webapi.insanityradio.com/subscribe?id=1"

	state = {
		nowPlaying: {
			song: null,
			artist: null,
			album_art: null
		},
		currentShow: {
			showName: null,
			showPresenters: null,
			showType: null
		},
		now: '1970-01-01T00:00:00Z',
		video: false
	}

	componentWillMount () {

		console.warn('fack')

		this.source = new WebSocketPlayerMetaBackend(this.URL);
		this.source.onData = (a) => this.setPlayingData(a);

		this.setupControls();

	}

	setupControls () {

		MusicControl.enableBackgroundMode(true);
		MusicControl.handleAudioInterruptions(true);
		MusicControl.enableControl('closeNotification', true, {when: 'paused'})

		MusicControl.enableControl('play', true)
		MusicControl.enableControl('pause', false)
		MusicControl.enableControl('stop', true)
		MusicControl.enableControl('nextTrack', false)
		MusicControl.enableControl('previousTrack', false)

		this.props.player.registerControl(MusicControl);

		this.props.player._onStateChange = (state) => {
			this.setPlayingData(this.state);
		}

	}

	componentWillUnmount () {
		this.source && this.source.destroy();
	}

	setPlayingData (data) {
		this.setState(data);

		if (this.props.playerState && this.props.playerState.playing) {
			MusicControl.setNowPlaying({
				title: data.nowPlaying.song,
				artwork: data.nowPlaying.album_art,
				artist: data.nowPlaying.artist	
			})
		}

	}

	render () {

		let style = { color: '#FFF', fontFamily: 'JosefinSans-Bold' }
		let style2 = { color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'JosefinSans' }

		return (
			<View style={{ minHeight: 64, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center' }}>
				<View style={{ marginTop: 10, marginBottom: 0, flexDirection: 'row', flexWrap: 'wrap' }}>
					<Text style={style}>{ this.state.currentShow.showName }</Text>
				</View>
				<View style={{ marginTop: 5, marginBottom: 10, flexDirection: 'row', flexWrap: 'wrap' }}>
					<Text style={{ textAlign: 'center' }}><Text style={style}>{ this.state.nowPlaying.song }</Text>
					{ this.state.nowPlaying.artist != null ? [
						<Text style={style2} key="a"> by </Text>,
						<Text style={ style} key="b">{ this.state.nowPlaying.artist }</Text>] : null }</Text>
				</View>
			</View>
		);

	}

}
