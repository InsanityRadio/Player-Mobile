import React from 'react';
import { StyleSheet, Text, View, BackHandler } from 'react-native';
import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui-upmenu-fork';

import Main from './views/Main';

import config from './config';

// eslint-disable-next-line import/no-extraneous-dependencies
import { YellowBox } from 'react-native';

const ThemeProvider = ThemeContext.Provider;

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
		console.log('App mounted')
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
	}

	componentWillUnmount () {
		console.log('App unmounting')
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
			console.log('Rendered whilst unready')
			return null;
		}
		console.log('render dbg', ThemeProvider, Main)
		return (
			<ThemeProvider value={getTheme(uiTheme)}>
				<Main />
			</ThemeProvider>
		);
	}

}

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { fontFamily: 'Josefin Sans' }
