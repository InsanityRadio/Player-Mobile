import React from 'react';
import { StyleSheet, Text, Image, View, StatusBar } from 'react-native';
import { COLOR, ThemeProvider, Toolbar } from 'react-native-material-ui';

import Container from './Container';
import PlayerControls from './PlayerControls';

import Player from '../Player';

export default class PlayerMain extends React.Component {

	render () {
		return (
			<View>
				<PlayerControls />
			</View>
		);
	}

}
