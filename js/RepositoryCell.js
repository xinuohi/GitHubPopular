/**
 *
 *
 * @flow
 */
'use strict';

import React, {Component} from 'react'
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableNativeFeedback,
    View,
    Alert,
} from 'react-native'
export default class RespositoryCell extends Component {
    constructor(propos) {
        super(propos);
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../res/images/ic_star_border_green_24dp.png') : require('../res/images/ic_star_border_gray_24dp.png'),
        };
    }

    componentWillReceiveProps(nextProps) {//当从当前页面切换走，再切换回来后
        this.setFavoriteState(nextProps.projectModel.isFavorite)
    }

    setFavoriteState(isFavorite) {
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../res/images/ic_star_border_green_24dp.png') : require('../res/images/ic_star_border_gray_24dp.png')
        })
    }

    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite)
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite)
    }

    render() {
        var item = this.props.projectModel.item;
        var TouchableElement = TouchableHighlight;
        return (
            <TouchableElement
                onPress={this.props.onSelect}
                onShowUnderlay={this.props.onHighlight}
                underlayColor='lightgreen'
                onHideUnderlay={this.props.onUnhighlight}>
                <View style={styles.row}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.title}>
                            {item.full_name}
                        </Text>

                    </View>
                    <Text style={styles.description}>
                        {item.description}
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.author}>Author: </Text>
                            <Image
                                style={{width: 22, height: 22,}}
                                source={{uri: item.owner.avatar_url}}
                            />
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.author}>Stars: </Text>
                            <Text style={styles.author}>
                                {item.stargazers_count}
                            </Text>
                        </View>
                        <TouchableHighlight onPress={()=>this.onPressFavorite()} underlayColor='transparent'>
                            <Image
                                ref='favoriteIcon'
                                style={{width: 26, height: 26,}}
                                source={this.state.favoriteIcon}/>
                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableElement>
        );
    }
}


var styles = StyleSheet.create({
    title: {
        fontSize: 14,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 12,
        marginBottom: 2,
        color: '#757575'
    },
    author: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    },
    row: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        marginVertical: 5,
        borderColor: '#dddddd',
        borderStyle: null,
        borderWidth: 0.5,
        borderRadius: 2,
    },
});

