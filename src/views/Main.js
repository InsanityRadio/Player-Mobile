import React from 'react';
import { StyleSheet, Text, Image, View, ScrollView, Animated, StatusBar, SafeAreaView } from 'react-native';
import { COLOR, Toolbar } from 'react-native-material-ui-upmenu-fork';
import Orientation from 'react-native-orientation-locker';

import Container from './Container';
import PlayerMain from './PlayerMain';

import Player from '../Player';
import ScheduleMain from './ScheduleMain';

import config from '../config';

const styles = StyleSheet.create({

	controls: {
		position: 'absolute',
		top: 60,
		left: 0,
		right: 0,
		overflow: 'hidden'
	},

	scrollView: {
		flex: 1,
		position: 'absolute',
		top: 60 + (config.getNormalisedPlatform() == 'ios' ? 15 : 0),
		left: 0,
		right: 0,
		bottom: 0
	}

})

export default class Main extends React.Component {

	state = {
		player: null,
		playerState: null,
		video: false
	}

	scrollY = new Animated.Value(0)

	componentWillMount () {
		Orientation.lockToPortrait();
		const initial = Orientation.getInitialOrientation();
		this.setOrientation(initial)
	}

	componentDidMount () {
		console.log('Main mounted')
		Orientation.addOrientationListener(this._orientationDidChange);
	}

	componentWillUnmount () {
		console.log('Main unmounting')
		Orientation.removeOrientationListener(this._orientationDidChange);
	}

	_orientationDidChange = (orientation) => {
		this.setOrientation(orientation)
	}

	setOrientation (orientation) {
		this.setState({
			fullscreen: orientation == 'LANDSCAPE'
		})
	}

	setPlayer (a) {
		if (this.player) {
			return;
		}
		this.player = a;
		this.setState({
			player: a
		})
	}

	render () {

		let fullscreen = this.state.fullscreen;

		console.log('main rnd dbg', Container, Toolbar, ScrollView, PlayerMain, Player)
		return (
			<Container>
				{ fullscreen || <Toolbar
					style={{ container: { height: 60 }}}
					centerElement={
						<Image
							style={{ width: 50 }}
							resizeMode="contain"
							source={ require('../../assets/images/headphones_light.png') } />
					} /> }
				<ScrollView
					style={ styles.scrollView }
					scrollEventThrottle={5}
					onScroll={ Animated.event(
						[{ nativeEvent: { contentOffset: { y: this.scrollY }}}]
					) }>
					<View style={{ marginTop: this.state.video ? 350 : 265 }}>
						<ScheduleMain />
					</View>
				</ScrollView>
				{ this.state.player && <PlayerMain
					styles={ styles }
					scrollY={ this.scrollY }
					player={ this.state.player }
					fullscreen={ fullscreen }
					onVideo={ (enabled) => this.setState({ video: enabled })}
					playerState={ this.state.playerState } /> }
				<Player
					ref={ (a) => this.setPlayer(a) }
					onStateChange={ (state) => this.setState({ playerState: state })} />
			</Container>
		);
	}

}
