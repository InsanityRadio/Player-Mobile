import React from 'react';
import { StyleSheet, Text, SafeAreaView, View, StatusBar } from 'react-native';
import { COLOR, ThemeProvider } from 'react-native-material-ui';

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#222222',
		flex: 1,
	},
});

export default class Container extends React.Component {

	render() {

		return (
			<View style={styles.container}>
				<StatusBar
					backgroundColor="#222222"
					translucent={ false }
					barStyle="light-content" />
				<SafeAreaView style={styles.container}>
					{ this.props.children }
				</SafeAreaView>
			</View>
		);
	
	}

}
