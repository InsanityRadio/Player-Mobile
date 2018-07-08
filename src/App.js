import React from 'react';
import { StyleSheet, Text, View, BackHandler } from 'react-native';
import { COLOR, ThemeProvider } from 'react-native-material-ui';

import Main from './views/Main';

const uiTheme = {
	palette: {
		primaryColor: '#222',
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
	
	componentDidMount () {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
	}

	componentWillUnmount () {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
	}

	handleBackButton() {
		return true;
	}

	pushLoad () {
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

Text.defaultProps.style = { fontFamily: 'Josefin Sans' }