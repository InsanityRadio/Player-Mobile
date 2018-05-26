import React from 'react';
import { Animated, StyleSheet, Text, Image, ImageBackground, View, StatusBar } from 'react-native';
import { COLOR, ThemeProvider, Toolbar, ActionButton } from 'react-native-material-ui';

import FontAwesome, { Icons } from 'react-native-fontawesome';

import Container from './Container';

class NoFloatActionButton extends ActionButton {

	renderButton = (styles) => (
		<Animated.View>
			{this.renderMainButton(styles)}	
		</Animated.View>
	)

}

export default class PlayerControls extends React.Component {

	render () {
		return (
			<View style={{ height: 200, backgroundColor: '#C00' }}>
				<ImageBackground
					style={{ height: 200, width: '100%' }}
					source={ require('../../assets/images/texture.jpg') }>

					<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', height: 200 }}>

						<View style={{ margin: 5 }}>
							<Image
								style={{ width: 150, height: 150 }}
								resizeMode="contain"
								source={ require('../../assets/images/logo_light.png') } />
						</View>

						<View style={{ flex: 1 }}>

						</View>

						<View style={{ marginRight: 15 }}>
							<View style={{ alignItems: 'center', flexDirection: 'row' }}>
								<NoFloatActionButton
									toolbar=""
									style={{ flex: 1, position: 'inherit' }}
									icon={ <FontAwesome style={{ fontSize: 24, color: '#000' }}>{Icons.pause}</FontAwesome> } />
							</View>
						</View>

					</View>

				</ImageBackground>
			</View>
		);
	}

}
