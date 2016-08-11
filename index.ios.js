/**
 * GitHubPopular
 * @flow
 */

import React, {Component} from 'react';

import {
    AppRegistry,
    StyleSheet,
    Navigator,
    Platform,
    TouchableOpacity,
    Text,
    Image,
    TabBarIOS,
    View
} from 'react-native'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import TabNavigator from 'react-native-tab-navigator'

import AboutPage from './js/page/AboutPage'
import PopularPage from './js/page/PopularPage'
import FavoritePage from './js/page/FavoritePage'
import NavigationBar from './js/common/NavigationBar'
var updateFavorite;
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
            <Component {...route.params} navigator={navigator}/>
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
                renderScene={this._renderScene}
            />
        )
    }

    _popularNavigator() {
        var component =
            <View style={{flex: 1}}>
                <NavigationBar
                    title='Popular'/>
                <ScrollableTabView
                    tabBarUnderlineColor='#4caf50'
                    tabBarInactiveTextColor='gray'
                    tabBarActiveTextColor='#4caf50'
                    ref="scrollableTabView"
                    initialPage={0}
                    renderTabBar={() => <ScrollableTabBar underlineHeight={2}/>}
                >
                    <PopularPage tabLabel='ALL' homeComponent={this}/>
                    <PopularPage tabLabel='iOS' homeComponent={this}/>
                    <PopularPage tabLabel='Android' homeComponent={this}/>
                    <PopularPage tabLabel='JavaScript' homeComponent={this}/>
                    <PopularPage tabLabel='Java' homeComponent={this}/>
                    <PopularPage tabLabel='Go' homeComponent={this}/>
                    <PopularPage tabLabel='CSS' homeComponent={this}/>
                    <PopularPage tabLabel='Object-c' homeComponent={this}/>
                    <PopularPage tabLabel='Python' homeComponent={this}/>
                    <PopularPage tabLabel='Swift' homeComponent={this}/>
                    <PopularPage tabLabel='HTML' homeComponent={this}/>
                </ScrollableTabView>
            </View>
        return this._navigator(()=>component, 'Popular');
    }

    render() {
        let tabBarHeight = 0;
        return (
            <TabNavigator
                //tabBarStyle={{ height: tabBarHeight,}}
                //sceneStyle={{ paddingBottom: tabBarHeight }}
            >
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'popularTab'}
                    title="Popular"
                    renderIcon={() => <Image source={require('./res/images/ic_whatshot_black_36dp.png')}/>}
                    //renderSelectedIcon={() => <Image source={require('./res/images/ic_whatshot_black_36dp.png')} />}
                    onPress={() => this.onSelected('popularTab')}>
                    {this._popularNavigator()}
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'favoriteTab'}
                    title="Favorite"
                    renderIcon={() => <Image source={require('./res/images/ic_favorite_black_36dp.png')}/>}
                    //renderSelectedIcon={() => <Image source={require('./res/images/ic_favorite_black_36dp.png')} />}
                    onPress={() => this.onSelected('favoriteTab')}>
                    {this._navigator(FavoritePage, 'Favorite')}
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'aboutTab'}
                    title="About"
                    renderIcon={() => <Image source={require('./res/images/ic_hdr_weak_black_36dp.png')}/>}
                    //renderSelectedIcon={() => <Image source={require('./res/images/ic_hdr_weak_black_36dp.png')} />}
                    onPress={() => this.onSelected('aboutTab')}>
                    {this._navigator(AboutPage, 'About')}
                </TabNavigator.Item>
            </TabNavigator>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    navBar: {
        alignItems: 'center',
        backgroundColor: '#4caf50',
        shadowOffset: {
            width: 1,
            height: 0.5,
        },
        shadowColor: '#55ACEE',
        shadowOpacity: 0.8,
    },
    title: {
        flex: 1, alignItems: 'center', justifyContent: 'center'
    },
    button: {
        flex: 1, width: 50, alignItems: 'center', justifyContent: 'center'
    },
    buttonText: {
        fontSize: 18, color: '#FFFFFF', fontWeight: '400'
    }
})

AppRegistry.registerComponent('GitHubPopular', () => GitHubPopular);
