import React from 'react';
import { Animated, StyleSheet, Text, Image, ImageBackground, View, StatusBar } from 'react-native';
import { COLOR, ThemeProvider, Toolbar, ActionButton } from 'react-native-material-ui';

import FontAwesome, { Icons } from 'react-native-fontawesome';

import config from '../config';

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

		this.id = ((Math.random() * 10000) | 0);
		this.connect();
	}

	connect () {

		// TODO: inject some sort of session resume in here
		this.ws = new WebSocket(this.url); 

		this.ws.onopen = (a) => {
			console.log('WebSocket opened (yay)')
		}

		this.ws.onmessage = (data) => {

			if (this.closing) {
				return;
			}

			//let proto = data.data.split("\n\n");

			console.log('rx', this.id, data.data);

			data = JSON.parse(data.data); //proto[1])
			this.emit(data);

		}

		this.ws.onclose = () => {
			console.log('WebSocket closed')
			this.closing || setTimeout(this.connect.bind(this), 100);
		}

		this.ws.onerror = (e) => {
			console.log('WebSocket error', e)
			this.closing || setTimeout(this.connect.bind(this), 100);
		}

	}

	emit (data) {
		this.onData(data);
	}

	destroy () {
		this.closing = true;
		this.close();

		clearInterval(this.int);
	}

	close () {
		this.ws.close();
	}

}

export default class PlayerMeta extends React.Component {

	URL = config.getURLForMeta();

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
		this.enableSource();
		this.setupControls();
	}

	enableSource () {
		this.source && this.source.destroy();
		this.source = new WebSocketPlayerMetaBackend(this.URL);
		// This is no longer needed provided last=1 works
		// this.source.onData = (a) => this.setPlayingDataWithWait(a);
		this.source.onData = (a) => this.setPlayingData(a);
	}

	disableSource () {
		this.source && this.source.destroy();
		this.source = null;
	}

	setupControls () {

		MusicControl.enableBackgroundMode(true);
		MusicControl.handleAudioInterruptions(true);
		MusicControl.enableControl('closeNotification', true, {when: 'paused'})

		MusicControl.enableControl('play', true)

		// iOS won't show a stop button, so we can use a pause one instead
		MusicControl.enableControl('pause', config.getNormalisedPlatform() == 'ios')
		MusicControl.enableControl('stop', true)
		MusicControl.enableControl('nextTrack', false)
		MusicControl.enableControl('previousTrack', false)

		this.props.player.registerControl(MusicControl);

		this.props.player._onStateChange = (state) => {
			setTimeout(() => this.setPlayingData(this.state), 10);
		}

	}

	componentWillUnmount () {
		this.disableSource();
	}

	setPlayingDataWithWait (data) {
		console.log('Queued set data', data, data.nowPlaying && data.nowPlaying.song)
		clearTimeout(this._timeout);
		this._timeout = setTimeout(() => {
			this.setPlayingData(data);
		}, 500);
	}

	setPlayingData (data) {
		this.setState(data);

		if (this.props.playerState && this.props.playerState.playing) {
			console.log('Updating music control data', data.nowPlaying.song)
			MusicControl.setNowPlaying({
				title: data.nowPlaying.song,
				artwork: data.nowPlaying.album_art,
				artist: data.nowPlaying.artist	
			})
		}

		// If we suddenly start buffering, we should keep the WebSocket open
		if (this.props.playerState && (this.props.playerState.playing || this.props.playerState.buffering)) {
			this.source || console.log('State change, enabling data source')
			this.source || this.enableSource();
		} else {
			console.log('State change, disabling data source')
			this.disableSource();
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
