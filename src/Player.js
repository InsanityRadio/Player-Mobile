import React from 'react';
import { Platform, DeviceEventEmitter } from 'react-native';
import RNAudioStreamer from 'react-native-audio-streamer';

import config from './config';

export default class Player extends React.Component {

	_onStateChange = () => null;

	constructor (props) {
		super(props);
		this.state = {
			playing: false,
			buffering: false
		}
	}

	componentWillMount () {

		this.subscription = DeviceEventEmitter.addListener('RNAudioStreamerStatusChanged', this.onStatusChanged.bind(this))

		RNAudioStreamer.status((err, status)=>{
			this.onStatusChanged(status);
			if (err) console.warn(err);
		})

		this.go();

	}

	componentWillUnmount () {
		this.stop();
	}

	onStatusChanged(state) {

		console.log('Playback state change', state)
		this.setState({
			stateID: state,
			playing: state == 'PLAYING',
			buffering: state == 'BUFFERING',
		}, this.onStateChange.bind(this));

	}

	onStateChange () {

		if (this.musicControl) {
			let s = this.musicControl;
			s.updatePlayback({
				state: this.state.playing ? s.STATE_PLAYING : (this.state.buffering ? s.STATE_BUFFERING : s.STATE_STOPPED),
				// We need to set elapsedTime for iOS to work, apparently
				elapsedTime: (Date.now() / 1000 | 0) - this.startTime
			})
		}

		this.props.onStateChange(this.state);

		// Nasty hack alert! 
		this._onStateChange(this.state);

	}

	go () {

		let url = config.getURLForAudio();
		console.log('Loading audio stream: ', url);

		this.startTime = Date.now() / 1000 | 0;

		RNAudioStreamer.setUrl(url);
		RNAudioStreamer.play();

	}

	stop () {
		RNAudioStreamer.pause();
		RNAudioStreamer.setUrl('');
	}

	toggle () {

		if (this.state.playing || this.state.buffering) {
			return this.stop();
		}

		this.go();

	}

	registerControl (musicControl) {

		this.musicControl = musicControl;

		musicControl.on('play', () => this.go());
		musicControl.on('stop', () => this.stop());
		musicControl.on('pause', () => this.stop());

	}

	render () {
		return null;
	}

}