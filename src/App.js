import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR, ThemeProvider } from 'react-native-material-ui';
import { Font } from 'expo';

import Main from './views/Main';

const uiTheme = {
	palette: {
		primaryColor: '#000',
		accentColor: '#FFF'
	},
	toolbar: {
		container: {
			height: 50,
		},
	}
};

export default class App extends React.Component {

	state = {
		ready: 0
	}
	
	componentWillMount () {

		this.pushLoad();

		Font.loadAsync({
			'open-sans': require('../assets/fonts/OpenSans-Regular.ttf'),
			'FontAwesome': require('../assets/fonts/FontAwesome.ttf')
		}).then((a) => {
			this.popLoad()
		});

	}

	pushLoad ( ){
		this.setState({
			ready: this.state.ready + 1
		});
	}

	popLoad () {
		this.setState({
			ready: this.state.ready - 1
		});
	}

	render() {
		if (this.state.ready != 0) {
			return null;
		}
		return (
			<ThemeProvider uiTheme={uiTheme}>
				<Main />
			</ThemeProvider>
		);
	}

}

Text.defaultProps.style = { fontFamily: 'open-sans' }