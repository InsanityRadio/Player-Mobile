import React from 'react';
import { Animated, StyleSheet, Text, Image, ImageBackground, View, StatusBar, AsyncStorage } from 'react-native';
import { COLOR, ThemeProvider, Toolbar, ActionButton, ListItem } from 'react-native-material-ui';

import FontAwesome, { Icons } from 'react-native-fontawesome';


export default class ScheduleMain extends React.Component {

	state = {
		loadedSchedule: {
			date: 0,
			schedule: {}
		},
		// Reload the schedule from the backend every 30 minutes. 
		scheduleReload: 1800000,
		day: null
	}

	constructor () {
		super();
		this.state.day = new Date().toISOString().split('T')[0]
	}

	componentWillMount () {

		AsyncStorage.getItem('@Insanity:schedule').then((data) => {
			if (data != null) {
				let schedule = JSON.parse(data);
				this.setState({
					loadedSchedule: schedule
				}, () => this.scheduleLoaded())
			} else {
				this.loadSchedule()
			}
		})

	}

	loadSchedule () {
		fetch('https://insanityradio.com/listen/load_status.json?version=1.2')
		.then((data) => data.json())
		.then((data) => this.setSchedule(data.schedule))
		.then((data) => this.scheduleLoaded())
	}

	setSchedule (schedule) {

		schedule = {
			schedule: schedule,
			date: Date.now()
		}

		AsyncStorage.setItem('@Insanity:schedule', JSON.stringify(schedule))

		this.setState({
			loadedSchedule: schedule
		}, () => this.scheduleLoaded())

	}

	scheduleLoaded () {

		let loadDate = new Date(this.state.loadedSchedule.date).getTime();
		let timeToNextRefresh = this.state.scheduleReload - (Date.now() - loadDate);

		// Look for signs of a weird corrupt schedule - it should last no more than 15 minutes
		if (loadDate > Date.now() || timeToNextRefresh <= 0 || timeToNextRefresh > this.state.scheduleReload) {
			this.loadSchedule();
		} else {
			setTimeout(() => this.loadSchedule(), timeToNextRefresh);
		}

	}

	componentWillUnmount () {
	}

	renderDay () {

		if (!this.state.loadedSchedule) return null;

		let shows = this.state.loadedSchedule.schedule[this.state.day] || [];

		let line = { flexDirection: 'column' }
		let pri = { color: '#000000' }
		let sec = {	opacity: 0.8 }

		return (
			<View>
				<ListItem
					divider
					centerElement={{ primaryText: 'Back' }}
					onPress={ (a) => this.setState({ day: null })} />
				{ shows.map((a) => <ListItem 
					divider
					leftElement={ <Text>{ a.time_display.split(" ").pop() }</Text> }
					key={ a.time_display }
					centerElement={
						<View style={ line }>
							<Text style={ a.show.category == 'automated' ? sec : pri } >{ a.show.name}</Text>
							{ a.show.hosts && a.show.hosts != a.show.name ? <Text style={ sec }>{ a.show.hosts }</Text> : null }
						</View>
					} />) }
				<ListItem
					centerElement={{ primaryText: 'Back' }}
					onPress={ (a) => this.setState({ day: null })} />
			</View>
		)
	}

	render () {

		let style = { color: '#FFF', fontFamily: 'JosefinSans-Bold' }
		let style2 = { color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'JosefinSans' }

		if (this.state.day) {
			return this.renderDay();
		}

		let days = Object.keys(this.state.loadedSchedule.schedule);

		return (
			<View>
				{ days.map((day) => <ListItem 
					divider
					key={ day }
					centerElement={{ primaryText: day }}
					onPress={ (a) => this.setState({ day: day }) } />) }
			</View>
		);

	}

}
