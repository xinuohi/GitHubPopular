/**
 * FavoritePage
 * @flow
 */
'use strict';
import React, {Component} from 'react'
import {
    ListView,
    Platform,
    StyleSheet,
    RefreshControl,
    View,
} from 'react-native'

import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'

import RepositoryCell from '../common/RepositoryCell'
import TrendingRepoCell from '../common/TrendingRepoCell'
import RepositoryDetail from './RepositoryDetail'
import FavoriteDao from '../expand/dao/FavoriteDao'
import ProjectModel from '../model/ProjectModel'
import NavigationBar from '../common/NavigationBar'
import {FLAG_STORAGE} from '../expand/dao/RespositoryDao'

export default class FavoritePage extends Component {
    render() {
        var content =
            <ScrollableTabView
                tabBarUnderlineColor='#4caf50'
                tabBarInactiveTextColor='gray'
                tabBarActiveTextColor='#4caf50'
                ref="scrollableTabView"
                initialPage={0}
                renderTabBar={() => <DefaultTabBar
                    style={{height: 42}}
                    textStyle={{textAlign:'center',lineHeight:25}}
                    underlineHeight={2}/>}
            >
                <FavoriteTab {...this.props} tabLabel='Popular' flag={FLAG_STORAGE.flag_popular}/>
                <FavoriteTab {...this.props} tabLabel='Trending' flag={FLAG_STORAGE.flag_trending}/>
            </ScrollableTabView>
        var navigationBar =
            <NavigationBar
                title='Favorite'/>;
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
            </View>
        );
    }

}

class FavoriteTab extends Component {
    constructor(propos) {
        super(propos);
        this.state = {
            isLoading: false,
            isLodingFail: false,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            filter: ''
        };
    }

    componentDidMount() {
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.loadData(true);
    }

    componentWillReceiveProps(nextProps) {//当从当前页面切换走，再切换回来后
        this.loadData(false);
    }

    loadData(isShowLoading) {
        if (isShowLoading)
            this.setState({
                isLoading: true,
                isLodingFail: false,
            });
        this.favoriteDao.getAllItems().then((items)=> {
            var resultData = [];
            for (var i = 0, len = items.length; i < len; i++) {
                resultData.push(new ProjectModel(items[i], true));
            }
            this.setState({
                isLoading: false,
                isLodingFail: false,
                dataSource: this.getDataSource(resultData),
            });
        }).catch((error)=> {
            this.setState({
                isLoading: false,
                isLodingFail: true,
            });
        });
    }

    onRefresh() {
        this.loadData(true);
    }

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    onSelectRepository(projectModel) {
        var belongNavigator = this.props.navigator ? this.props.navigator : this.props.homeComponent.refs.navFavorite;
        var item = projectModel.item;
        belongNavigator.push({
            title: item.full_name,
            component: RepositoryDetail,
            params: {
                projectModel: projectModel,
                flag:this.props.flag
            },
        });
    }

    onFavorite(item, isFavorite) {
        var key=this.props.flag===FLAG_STORAGE.flag_popular? item.id.toString():item.fullName;
        if (isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
    }

    renderRow(projectModel, sectionID, rowID) {
        var CellComponent=this.props.flag===FLAG_STORAGE.flag_popular? RepositoryCell:TrendingRepoCell;

        return (
            <CellComponent
                key={this.props.flag===FLAG_STORAGE.flag_popular? projectModel.item.id:projectModel.item.fullName}
                onFavorite={(e)=>this.onFavorite(e)}
                isFavorite={true}
                onSelect={()=>this.onSelectRepository(projectModel)}
                projectModel={projectModel}/>
        );
    }
    render() {
        var content =
            <ListView
                ref="listView"
                style={styles.listView}
                renderRow={(e)=>this.renderRow(e)}
                enableEmptySections={true}
                //renderSeparator={this.renderSeparator}
                dataSource={this.state.dataSource}
                refreshControl={
                    <RefreshControl
                        //style={{paddingTop:20}}
                        refreshing={this.state.isLoading}
                        onRefresh={()=>this.onRefresh()}
                        tintColor="#ff0000"
                        title="Loading..."
                        titleColor="#00ff00"
                        colors={['#ff0000', '#00ff00', '#0000ff']}
                        progressBackgroundColor="#ffff00"
                    />}
            />;
        return (
            <View style={styles.container}>
                {content}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        // backgroundColor:'red'
    },
    listView: {
        // marginTop: Platform.OS === "ios" ? 0 : 0,
    },
    separator: {
        height: 1,
        backgroundColor: '#eeeeee',
    },
});
