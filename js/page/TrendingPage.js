/**
 * TrendingPage
 * @flow
 */
'use strict';
import React, {Component} from "react";
import {ListView, StyleSheet, RefreshControl, View} from "react-native";
import TrendingRepoCell from "../common/TrendingRepoCell";
import RepositoryDetail from "./RepositoryDetail";
import FavoriteDao from "../expand/dao/FavoriteDao";
import RespositoryDao, {FLAG_STORAGE} from "../expand/dao/RespositoryDao";
import ProjectModel from "../model/ProjectModel";
import Trending from "../expand/trending/GitHubTrending";

const API_URL = 'https://github.com/trending/'
var projectModels = [];
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)
var respositoryDao = new RespositoryDao(FLAG_STORAGE.flag_trending)
var trending = new Trending()

export default class TrendingPage extends Component {
    constructor(propos) {
        super(propos);
        this.state = {
            isLoading: false,
            isLodingFail: false,
            favoritKeys: [],
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2)=>row1 !== row2,
            }),
            filter: '',
        };
    }

    componentDidMount() {
        this.props.homeComponent.updateFavorite = ()=>this.updateFavorite();//向homeComponent注册updateFavorite回调，以便监听Tab切换事件
        this.loadData();
        this.fetchCache();
    }

    componentWillReceiveProps(nextProps) {//当从当前页面切换走，再切换回来后
        nextProps.homeComponent.updateFavorit = ()=>this.updateFavorite();//向homeComponent注册updateFavorite回调，以便监听Tab切换事件
        this.updateFavorite(nextProps.tabLabel);
    }

    updateFavorite(selectedTab) {
        this.getFavoriteKeys(true);
    }

    flushFavoriteState() {//更新ProjectItem的Favorite状态
        projectModels = [];
        var items = this.state.items;
        for (var i = 0, len = items.length; i < len; i++) {
            projectModels.push(new ProjectModel(items[i], this.checkFavorite(items[i])));
        }
        if (!this)return;
        this.setState({
            isLoading: false,
            isLodingFail: false,
            dataSource: this.getDataSource(projectModels),
        });
    }

    getFavoriteKeys(isFlush) {//获取本地用户收藏的ProjectItem
        favoriteDao.getFavoriteKeys().then((keys)=> {
            if (keys) {
                if (!this)return;
                this.setState({
                    favoritKeys: keys
                })
            }
            if (isFlush) this.flushFavoriteState();
        }).catch((error)=> {
            if (isFlush) this.flushFavoriteState();
            console.log(error);
        });
    }

    genFetchUrl(category) {
        return API_URL + category;
    }

    fetchCache() {
        if (!this)return;
        this.setState({
            isLoading: true,
            isLodingFail: false,
        });
        respositoryDao.getRespository(FLAG_STORAGE.flag_trending, this.props.tabLabel).then((items)=> {
            if (items) {
                if (!this)return;
                this.setState({
                    items: items
                })
                this.getFavoriteKeys(true);
            }
        }).catch((error)=> {

        });
    }

    loadData() {
        if (!this)return;
        this.setState({
            isLoading: true,
            isLodingFail: false,
        });
        trending.fetchTrending(this.genFetchUrl(this.props.tabLabel))
            .then((items)=> {
                if (!this)return;
                this.setState({
                    items: items ? items : []
                })
                this.getFavoriteKeys(true);
                if (items)respositoryDao.saveRespository(FLAG_STORAGE.flag_trending, this.props.tabLabel, items);

            }).catch((error)=> {
            console.log(error);
            if (!this)return;
            this.setState({
                isLoading: false,
                isLodingFail: true,
            })
        })

    }
    onRefresh() {
        this.loadData();
    }

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    onSelectRepository(projectModel) {
        var belongNavigator = this.props.homeComponent.refs.navPopular;
        var item = projectModel.item;
        belongNavigator.push({
            title: item.full_name,
            component: RepositoryDetail,
            params: {
                projectModel: projectModel,
                parentComponent: this
            },
        });
    }

    onFavorite(item, isFavorite) {//favoriteIcon单击回调函数
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(item.id.toString());
        }
    }

    checkFavorite(item) {//检查该Item是否被收藏
        for (var i = 0, len = this.state.favoritKeys.length; i < len; i++) {
            if (item.id.toString() === this.state.favoritKeys[i]) {
                return true;
            }
        }
        return false;
    }

    renderRow(projectModel, sectionID, rowID) {
        return (
            <TrendingRepoCell
                key={projectModel.item.fullName}
                onSelect={()=>this.onSelectRepository(projectModel)}
                projectModel={projectModel}
                onFavorite={(item, isFavorite)=>this.onFavorite(item, isFavorite)}/>
        );
    }

    render() {
        var content =
            <ListView
                ref="listView"
                style={styles.listView}
                renderRow={(e)=>this.renderRow(e)}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                refreshControl={
                    <RefreshControl
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
        backgroundColor: '#f0f8ff',
        // backgroundColor:'red'
    },
    listView: {
        // marginTop:-20,
    },
    separator: {
        height: 1,
        backgroundColor: '#eeeeee',
    },
    rowSeparator: {
        // backgroundColor:'red',
        // height: 5,
        // marginLeft: 4,
    },
});
