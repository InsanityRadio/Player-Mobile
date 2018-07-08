import React from 'react';
import { StyleSheet, Text, Image, View, ScrollView, Animated, StatusBar } from 'react-native';
import { COLOR, ThemeProvider, Toolbar } from 'react-native-material-ui';

import Container from './Container';
import PlayerMain from './PlayerMain';

import Player from '../Player';

import ScheduleMain from './ScheduleMain';

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
		top: 60,
		left: 0,
		right: 0,
		bottom: 0
	}

})

export default class Main extends React.Component {

	state = {
		player: null,
		playerState: null
	}

	scrollY = new Animated.Value(0)

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

		return (
			<Container>
				<Toolbar
					leftElement="menu"
					style={{ container: { height: 60 }}}
					centerElement={
						<Image
							style={{ width: 50 }}
							resizeMode="contain"
							source={ require('../../assets/images/headphones_light.png') } />
					} />
				<ScrollView
					style={ styles.scrollView }
					scrollEventThrottle={5}
					onScroll={ Animated.event(
						[{ nativeEvent: { contentOffset: { y: this.scrollY }}}]
					) }>
					<View style={{ marginTop: 300 }}>
						<ScheduleMain />
					</View>
				</ScrollView>
				{ this.state.player && <PlayerMain
					styles={ styles }
					scrollY={ this.scrollY }
					player={ this.state.player }
					playerState={ this.state.playerState } /> }
				<Player
					ref={ (a) => this.setPlayer(a) }
					onStateChange={ (state) => this.setState({ playerState: state })} />
			</Container>
		);
	}

}
