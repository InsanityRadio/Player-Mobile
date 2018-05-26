import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { COLOR, ThemeProvider } from 'react-native-material-ui';

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default class Container extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<StatusBar
					backgroundColor="#000000"
					translucent={ false }
					barStyle="light-content"
					/>
				{ this.props.children }
			</View>
		);
	}
}
