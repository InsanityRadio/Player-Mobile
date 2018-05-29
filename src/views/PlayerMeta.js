import React from 'react';
import { Animated, StyleSheet, Text, Image, ImageBackground, View, StatusBar } from 'react-native';
import { COLOR, ThemeProvider, Toolbar, ActionButton } from 'react-native-material-ui';

import FontAwesome, { Icons } from 'react-native-fontawesome';

import Container from './Container';

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
		this.source = new WebSocketPlayerMetaBackend(this.URL);
		this.source.onData = (a) => this.setState(a);
	}

	componentWillUnmount () {
		this.source && this.source.destroy();
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
