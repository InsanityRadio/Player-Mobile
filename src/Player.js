import React from 'react';
import { Platform, DeviceEventEmitter } from 'react-native';
import RNAudioStreamer from 'react-native-audio-streamer';

import config from './config';

export default class Player extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			playing: false,
			buffering: false
		}
	}

	componentWillMount () {

		this.updateState(0)

		this.subscription = DeviceEventEmitter.addListener('RNAudioStreamerStatusChanged', this._statusChanged.bind(this))

		RNAudioStreamer.status((err, status)=>{
			this._statusChanged(status);
			if (err) console.warn(err);
		})

		this.go();

		/*TrackPlayer.setupPlayer().then(async () => {

			TrackPlayer.registerEventHandler(async (data) => {

				switch(data.type) {
					case 'playback-state': return this.updateState(await TrackPlayer.getState())
					case 'remote-play': return this.go();
					case 'remote-stop': return TrackPlayer.stop();
					case 'remote-duck': return data.ducking ? TrackPlayer.stop() : this.go();
					case 'playback-queue-ended': return this.go();
					default: break;
				}
			})

			TrackPlayer.updateOptions({
				capabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_STOP]
			})

			this.go();

		}); */

	}

	componentWillUnmount () {
		this.stop();
	}

	updateState (state) {
		return;
		this.setState({
			stateID: state,
			playing: state == TrackPlayer.STATE_PLAYING,
			buffering: state == TrackPlayer.STATE_BUFFERING
		}, () => this.props.onStateChange(this.state));
	}

	_statusChanged(state) {

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
				state: this.state.playing ? s.STATE_PLAYING : (this.state.buffering ? s.STATE_BUFFERING : s.STATE_STOPPED)
			})
		}

		this.props.onStateChange(this.state);
		this._onStateChange(this.state);

	}

	go () {

		let ios = 'http://scdnc.insanityradio.com/dash/hls/insanity/index.m3u8'; //'https://stream.cor.insanityradio.com/insanity128.aac',
			android = 'http://scdnc.insanityradio.com/dash/dash/insanity/index.mpd'; //'https://stream.cor.insanityradio.com/insanity/hls/insanity.m3u8';

		let url = Platform.OS != 'ios' ? ios : android;

		RNAudioStreamer.setUrl(config.getURLForAudio());
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
		musicControl.on('play', () => {
			this.go();
		})
		musicControl.on('stop', () => {
			this.stop();
		})
		musicControl.on('pause', () => {
			this.stop();
		})
	}

	render () {
		return null;
	}

}