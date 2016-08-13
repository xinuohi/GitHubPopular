/**
 * GitHubPopular
 * @flow
 */

import React, {Component} from 'react';

import {
    AppRegistry,
    StyleSheet,
    Navigator,
    Image,
    View
} from 'react-native'
import TabNavigator from 'react-native-tab-navigator'
import AboutPage from './js/page/AboutPage'
import PopularPage from './js/page/PopularPage'
import TrendingPage from './js/page/TrendingPage'
import FavoritePage from './js/page/FavoritePage'
var updateFavorite

export default class GitHubPopular extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'popularTab',
        };
    }

    onSelected(object) {
        if (this.updateFavorite && 'popularTab' === object)this.updateFavorite(object);
        this.setState({
            selectedTab: object,
        })
    }

    _renderScene(route, navigator) {
        let Component = route.component;
        return (
            <Component {...route.params} homeComponent={this} navigator={navigator}/>
        );
    }

    _navigator(defaultComponent, defaultName) {
        return (
            <Navigator
                ref={'nav' + defaultName}
                style={styles.container}
                initialRoute={{
                    name: 'Popular',
                    component: defaultComponent
                }}
                renderScene={(e, i)=>this._renderScene(e, i)}
            />
        )
    }

    render() {
        return (
            <TabNavigator>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'popularTab'}
                    title="Popular"
                    renderIcon={() => <Image style={styles.tabBarIcon}
                                             source={require('./res/images/ic_whatshot_black_36dp.png')}/>}
                    //renderSelectedIcon={() => <Image source={require('./res/images/ic_whatshot_black_36dp.png')} />}
                    onPress={() => this.onSelected('popularTab')}>
                    {this._navigator(PopularPage, 'Popular')}
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'trendingTab'}
                    title="Trending"
                    renderIcon={() => <Image style={styles.tabBarIcon}
                                             source={require('./res/images/ic_whatshot_black_36dp.png')}/>}
                    //renderSelectedIcon={() => <Image source={require('./res/images/ic_whatshot_black_36dp.png')} />}
                    onPress={() => this.onSelected('trendingTab')}>
                    {this._navigator(TrendingPage, 'Trending')}
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'favoriteTab'}
                    title="Favorite"
                    renderIcon={() => <Image style={styles.tabBarIcon}
                                             source={require('./res/images/ic_favorite_black_36dp.png')}/>}
                    //renderSelectedIcon={() => <Image source={require('./res/images/ic_favorite_black_36dp.png')} />}
                    onPress={() => this.onSelected('favoriteTab')}>
                    {this._navigator(FavoritePage, 'Favorite')}
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'aboutTab'}
                    title="About"
                    renderIcon={() => <Image style={styles.tabBarIcon}
                                             source={require('./res/images/ic_hdr_weak_black_36dp.png')}/>}
                    //renderSelectedIcon={() => <Image source={require('./res/images/ic_hdr_weak_black_36dp.png')} />}
                    onPress={() => this.onSelected('aboutTab')}>
                    {this._navigator(AboutPage, 'About')}
                </TabNavigator.Item>
            </TabNavigator>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    tabBarIcon: {
        width: 26, height: 26,
        resizeMode: 'contain'
    }
})

AppRegistry.registerComponent('GitHubPopular', () => GitHubPopular);
