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
    TabBarIOS,
    View
} from 'react-native'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import AboutPage from './js/page/AboutPage'
import PopularPage from './js/page/PopularPage'
import FavoritePage from './js/page/FavoritePage'
import NavigationBar from './js/common/NavigationBar'
var updateFavorite;
class GitHubPopular extends Component {
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
                //sceneStyle={{paddingTop: (Platform.OS === 'android' ? 66 : 64)}}
                //navigationBar={this._renderNavBar(defaultName)}
            />
        )
    }

    _popularNavigator() {
        var component =
            <View style={{flex: 1}}>
                <NavigationBar
                    title='Popular'/>
                <ScrollableTabView
                    style={{paddingBottom: 50}}
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

    _tbItem(title, icon, selectedTab, navigator) {
        return (
            <TabBarIOS.Item
                title={title}
                icon={icon}
                selectedIcon={icon}
                selected={this.state.selectedTab === selectedTab}
                onPress={()=>this.onSelected(selectedTab)}
            >
                {navigator}
            </TabBarIOS.Item>
        )
    }

    render() {
        return (
            <TabBarIOS
                tintColor="#4caf50"
                unselectedTintColor="lightslategray"
                barTintColor="ghostwhite">
                {this._tbItem('Popular', require('./res/images/ic_whatshot_black_36dp.png'), 'popularTab', this._popularNavigator())}
                {this._tbItem('Favorite', require('./res/images/ic_favorite_black_36dp.png'), 'favoriteTab', this._navigator(FavoritePage, 'Favorite'))}
                {this._tbItem('About', require('./res/images/ic_hdr_weak_black_36dp.png'), 'aboutTab', this._navigator(AboutPage, 'About'))}
            </TabBarIOS>
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
