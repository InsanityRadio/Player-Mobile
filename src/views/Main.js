import React from 'react';
import { StyleSheet, Text, Image, View, StatusBar } from 'react-native';
import { COLOR, ThemeProvider, Toolbar } from 'react-native-material-ui';

import Container from './Container';
import PlayerMain from './PlayerMain';

export default class Main extends React.Component {

	render () {
		console.log(require('../../assets/images/headphones_light.png'))
		return (
			<Container>
				<Toolbar
					leftElement="menu"
					centerElement={
						<Image
							style={{ width: 50 }}
							resizeMode="contain"
							source={ require('../../assets/images/headphones_light.png') } />
					} />
				<PlayerMain />
			</Container>
		);
	}

}
