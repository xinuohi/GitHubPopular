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
import TrendingPage from './js/page/TrendingPage'
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

    _popularNavigator(title) {
        var TargetPage=title==='Popular'? PopularPage:TrendingPage;
        var component =
            <View style={{flex: 1}}>
                <NavigationBar
                    title={title}/>
                <ScrollableTabView
                    tabBarUnderlineColor='#4caf50'
                    tabBarInactiveTextColor='gray'
                    tabBarActiveTextColor='#4caf50'
                    ref="scrollableTabView"
                    initialPage={0}
                    renderTabBar={() => <ScrollableTabBar style={{height:42}} tabStyle={{height:41}} underlineHeight={2}/>}
                >
                    <TargetPage tabLabel='ALL' homeComponent={this}/>
                    <TargetPage tabLabel='iOS' homeComponent={this}/>
                    <TargetPage tabLabel='Android' homeComponent={this}/>
                    <TargetPage tabLabel='JavaScript' homeComponent={this}/>
                    <TargetPage tabLabel='Java' homeComponent={this}/>
                    <TargetPage tabLabel='Go' homeComponent={this}/>
                    <TargetPage tabLabel='CSS' homeComponent={this}/>
                    <TargetPage tabLabel='Object-c' homeComponent={this}/>
                    <TargetPage tabLabel='Python' homeComponent={this}/>
                    <TargetPage tabLabel='Swift' homeComponent={this}/>
                    <TargetPage tabLabel='HTML' homeComponent={this}/>
                </ScrollableTabView>
            </View>
        return this._navigator(()=>component, title);
    }

    render() {
        let tabBarHeight = 0;
        return (
            <TabNavigator
                tabBarStyle={{}}
                sceneStyle={{}}
            >
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'popularTab'}
                    title="Popular"
                    renderIcon={() => <Image style={styles.tabBarIcon} source={require('./res/images/ic_whatshot_black_36dp.png')}/>}
                    //renderSelectedIcon={() => <Image source={require('./res/images/ic_whatshot_black_36dp.png')} />}
                    onPress={() => this.onSelected('popularTab')}>
                    {this._popularNavigator('Popular')}
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'trendingTab'}
                    title="Trending"
                    renderIcon={() => <Image style={styles.tabBarIcon} source={require('./res/images/ic_whatshot_black_36dp.png')}/>}
                    //renderSelectedIcon={() => <Image source={require('./res/images/ic_whatshot_black_36dp.png')} />}
                    onPress={() => this.onSelected('trendingTab')}>
                    {this._popularNavigator('Trending')}
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'favoriteTab'}
                    title="Favorite"
                    renderIcon={() => <Image style={styles.tabBarIcon} source={require('./res/images/ic_favorite_black_36dp.png')}/>}
                    //renderSelectedIcon={() => <Image source={require('./res/images/ic_favorite_black_36dp.png')} />}
                    onPress={() => this.onSelected('favoriteTab')}>
                    {this._navigator(FavoritePage, 'Favorite')}
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'aboutTab'}
                    title="About"
                    renderIcon={() => <Image style={styles.tabBarIcon} source={require('./res/images/ic_hdr_weak_black_36dp.png')}/>}
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
    tabBarIcon:{
        width:26,height:26,
        resizeMode:'contain'
    }
})

AppRegistry.registerComponent('GitHubPopular', () => GitHubPopular);
