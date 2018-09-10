import React from 'react';
import { StyleSheet, Text, View, BackHandler } from 'react-native';
import { COLOR, ThemeProvider } from 'react-native-material-ui';

import Main from './views/Main';

import config from './config';

// eslint-disable-next-line import/no-extraneous-dependencies
import { YellowBox } from 'react-native';

function ignoreWarnings(type, ignoreMessages) {
	if (!ignoreMessages) {
	ignoreMessages = type;
	type = 'warn';
	}
	if (!Array.isArray(ignoreMessages)) ignoreMessages = [ignoreMessages];
	const overloadedConsole = {
	// eslint-disable-next-line no-console
	log: console.log,
	// eslint-disable-next-line no-console
	info: console.info,
	// eslint-disable-next-line no-console
	warn: console.warn,
	// eslint-disable-next-line no-console
	error: console.error
	};
	// eslint-disable-next-line no-console
	console[type] = (...args) => {
		let log = true;
		ignoreMessages.forEach(ignoreMessage => {
			const message = args.join(' ').slice(0, -1);
			if (message.indexOf(ignoreMessage) > -1) {
				log = false;
				return false;
			}
			return true;
		});
		if (log) overloadedConsole[type](...args);
	};
}

(function(type, ignoreMessages) {
	if (!ignoreMessages) {
		ignoreMessages = type;
		type = 'warn';
	}
	if (!Array.isArray(ignoreMessages)) ignoreMessages = [ignoreMessages];
	YellowBox.ignoreWarnings(ignoreMessages);
	ignoreWarnings(type, ignoreMessages);
})('Setting a timer')

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

	componentWillMount () {
		this.pushLoad();
		config.loadConfig().then((a) => this.popLoad());
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