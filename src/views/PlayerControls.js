import React from 'react';
import { Animated, StyleSheet, Text, Image, ImageBackground, View, StatusBar } from 'react-native';
import { COLOR, ThemeProvider, Toolbar, ActionButton } from 'react-native-material-ui';

import FontAwesome, { Icons } from 'react-native-fontawesome';

import Container from './Container';

class NoFloatActionButton extends ActionButton {

	renderButton = (styles) => (
		<Animated.View style={{ marginRight: 15 }}>
			{this.renderMainButton(styles)}	
		</Animated.View>
	)

}

export default class PlayerControls extends React.Component {

	getPlayerState () {
		return this.props.playerState || {
			playing: false,
			buffering: true
		}
	}

	toggleVideo () {
		this.props.loadVideo();
	}

	render () {

		let icon = Icons.play;
		let state = this.getPlayerState();

		if (state.playing) {
			icon = Icons.pause;
		} else if (state.buffering) {
			icon = Icons.ellipsisH;
		}

		if (!this.props.player) {
			return null;
		}

		const height = this.props.scrollY.interpolate({
			inputRange: [0, 150],
			outputRange: [200, 50],
			extrapolate: 'clamp'
		})

		const opacity = this.props.scrollY.interpolate({
			inputRange: [100, 120],
			outputRange: [1, 0]
		})

		let video = true;

		return (
			<Animated.View style={{ height: height, backgroundColor: '#C00' }}>
				<ImageBackground
					style={{ height: '100%', width: '100%' }}
					source={ require('../../assets/images/texture.jpg') }>

					<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', height: '100%' }}>

						<View style={{ margin: 5 }}>
							<Animated.Image
								style={{ width: 150, height: 150, opacity: opacity }}
								resizeMode="contain"
								source={ require('../../assets/images/logo_light.png') } />
						</View>

						<View style={{ flex: 1 }}>

						</View>

						<View style={{ marginRight: 0 }}>
							<View style={{ alignItems: 'center', flexDirection: 'row' }}>

								{ video && <NoFloatActionButton
									toolbar=""
									onPress={ this.toggleVideo.bind(this) }
									style={{ flex: 1, marginRight: 10, position: 'inherit' }}
									icon={ <FontAwesome style={{ fontSize: 24, color: '#000' }}>{ Icons.videoCamera }</FontAwesome> } /> }

								<NoFloatActionButton
									toolbar=""

									onPress={ this.props.player.toggle.bind(this.props.player) }

									style={{ flex: 1, position: 'inherit' }}
									icon={ <FontAwesome style={{ fontSize: 24, color: '#000' }}>{ icon }</FontAwesome> } />
							</View>
						</View>

					</View>

				</ImageBackground>
			</Animated.View>
		);
	}

}
