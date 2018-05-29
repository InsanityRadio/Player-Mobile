import React from 'react';
import { Platform } from 'react-native';
import TrackPlayer from 'react-native-track-player';

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


		TrackPlayer.setupPlayer().then(async () => {

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

		});

	}

	componentWillUnmount () {
		this.stop();
	}

	updateState (state) {
		this.setState({
			stateID: state,
			playing: state == TrackPlayer.STATE_PLAYING,
			buffering: state == TrackPlayer.STATE_BUFFERING
		}, () => this.props.onStateChange(this.state));
	}

	go () {

		let ios = 'https://stream.cor.insanityradio.com/insanity128.aac',
			android = 'https://stream.cor.insanityradio.com/insanity/hls/insanity.m3u8';

		TrackPlayer.reset();

		TrackPlayer.add({
			id: 'insanity',
			url: Platform.OS == 'ios' ? ios : android,
			title: 'Insanity Radio',
			artist: 'Artist',
		}).then(() => TrackPlayer.play());

	}

	stop () {
		TrackPlayer.stop();
	}

	toggle () {

		if (this.state.playing || this.state.buffering) {
			return TrackPlayer.stop();
		}

		this.go();

	}

	render () {
		return null;
	}

}