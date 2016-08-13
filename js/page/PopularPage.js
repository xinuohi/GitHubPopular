/**
 * PopularPage
 * @flow
 */
'use strict';
import React, {Component} from 'react'
import {
    ListView,
    StyleSheet,
    RefreshControl,
    View,
} from 'react-native'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import NavigationBar from '../common/NavigationBar'
import RepositoryCell from '../common/RepositoryCell'
import RepositoryDetail from './RepositoryDetail'
import FavoriteDao from '../expand/dao/FavoriteDao'
import RespositoryDao,{FLAG_STORAGE} from '../expand/dao/RespositoryDao'
import ProjectModel from '../model/ProjectModel'
var API_URL = 'https://api.github.com/search/repositories?q='
var QUERY_STR = '&sort=stars'
var projectModels = [];
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
var respositoryDao = new RespositoryDao(FLAG_STORAGE.flag_popular)

export default class PopularPage extends Component {
    render() {
        var content =
            <ScrollableTabView
                tabBarUnderlineColor='#4caf50'
                tabBarInactiveTextColor='gray'
                tabBarActiveTextColor='#4caf50'
                ref="scrollableTabView"
                initialPage={0}
                renderTabBar={() => <ScrollableTabBar style={{height:42}} tabStyle={{height:41}} underlineHeight={2}/>}
            >
                <PopularTab {...this.props}  tabLabel='ALL' />
                <PopularTab {...this.props}  tabLabel='iOS' />
                <PopularTab {...this.props}  tabLabel='Android' />
                <PopularTab {...this.props}  tabLabel='JavaScript' />
                <PopularTab {...this.props}  tabLabel='Java' />
                <PopularTab {...this.props}  tabLabel='Go' />
                <PopularTab {...this.props}  tabLabel='CSS' />
                <PopularTab {...this.props}  tabLabel='Object-c' />
                <PopularTab {...this.props}  tabLabel='Python' />
                <PopularTab {...this.props}  tabLabel='Swift' />
                <PopularTab {...this.props}  tabLabel='HTML' />
            </ScrollableTabView>
        var navigationBar =
            <NavigationBar
                title='Popular'/>;
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
            </View>
        );
    }

}
class PopularTab extends Component {
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
        return API_URL + (category === 'ALL' ? 'stars:>1' : category) + QUERY_STR;
    }

    fetchCache() {
        if (!this)return;
        this.setState({
            isLoading: true,
            isLodingFail: false,
        });
        respositoryDao.getRespository(this.props.tabLabel).then((items)=> {
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
        fetch(this.genFetchUrl(this.props.tabLabel))
            .then((response)=>response.json())
            .catch((error)=> {
                if (!this)return;
                this.setState({
                    isLoading: false,
                    isLodingFail: true,
                });
            }).then((responseData)=> {
            if (!this)return;
            this.setState({
                items: responseData.items ? responseData.items : []
            })
            this.getFavoriteKeys(true);
            if (responseData)respositoryDao.saveRespository(this.props.tabLabel, responseData.items);
        })
            .done();
    }

    onRefresh() {
        this.loadData();
    }

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    onSelectRepository(projectModel) {
        var item = projectModel.item;
        this.props.navigator.push({
            title: item.full_name,
            component: RepositoryDetail,
            params: {
                projectModel: projectModel,
                parentComponent: this,
                flag:FLAG_STORAGE.flag_popular
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
            <RepositoryCell
                key={projectModel.item.id}
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
});
