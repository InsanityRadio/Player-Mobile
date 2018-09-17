import React from 'react';
import { AsyncStorage } from 'react-native';

/**
 * A very simple persistent get/set storage engine.
 * It is much more lightweight than using react context. 
 */
class ObservableStorage {

	static getInstance () {

		let base = 'com.insanityradio.player_v2';

		if (!ObservableStorage.instance) {
			ObservableStorage.instance = new ObservableStorage(base);
		}
		return ObservableStorage.instance;

	}

	callbacks = {};

	constructor (base) {
		this.base = '@' + base + ':';
	}

	setItem (key, value, callback) {
		return AsyncStorage.setItem(this.base + key, value, callback).then((p) => this.itemSet(p, key, value));
	}

	itemSet (p, key, value) {

		if (this.callbacks[key]) {
			try {
				this.callbacks[key].forEach((callback) => callback(key, value));
			} catch (e) {
				console.error('Error running observe handler', e);
			}
		}

		return p;

	}

	getItem (key) {
		return AsyncStorage.getItem(this.base + key);
	}

	multiGet(keys, callback) {

		let modifiedKeys = keys.map((a) => this.base + a);

		return AsyncStorage.multiGet(modifiedKeys, (errors, data) => {
			// Replace the keys with the original ones. 
			data = data.map((a) => [a[0].substr(this.base.length), a[1]])
			callback(errors, data);
		});

	}

	addChangeListener (key, callback) {

		if (!this.callbacks[key]) this.callbacks[key] = [];

		this.callbacks[key].push(callback);

	}

	removeChangeListener (key, callback) {

		if (!this.callbacks[key]) {
			return;
		}

		this.callbacks[key] = this.callbacks[key].filter((a) => a != callback);

	}

}

/**
 * A React wrapper around ObservableStorage that sets its value as a prop on the child component
 */ 

function withObserver (WrappedComponent, observedKeys) {

	return class extends React.Component {

		state = {
			observed: {}
		}

		constructor (props) {

			super(props);

			this.observableStorage = ObservableStorage.getInstance();
			this.bindedChangeState = this.changeState.bind(this);

			let data = {};

			// Listen to the keys
			observedKeys.forEach((key) => {
				data[key] = null;
				this.addListener(key);
			});

			// Placeholder values
			this.state = {
				observed: data
			}

			this.reload();

		}

		reload () {
			this.observableStorage.multiGet(observedKeys, (errors, pair) => {
				pair = Object.assign(...pair.map( ([k, v]) => ({[k]: v}) ));
				this.setState(pair)
			})
		}

		addListener (key) {
			this.observableStorage.getItem(key).then((a) => this.changeState(key, a));
			this.observableStorage.addChangeListener(key, this.bindedChangeState);
		}

		removeListener (key) {
			this.observableStorage.removeChangeListener(key, this.bindedChangeState);
			this.changeState(key, null);
		}

		changeState (key, value) {
			let observed = Object.assign({}, this.state.observed, { [key]: value });
			this.setState({
				observed: observed
			})
		}

		render () {
			return <WrappedComponent observed={ this.state.observed } {...this.props} />;
		}

	}

}

export { ObservableStorage, withObserver }