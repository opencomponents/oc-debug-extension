import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import ArrowBack from 'material-ui/lib/svg-icons/navigation/arrow-back';
import Theme from './theme';
import ThemeManager from 'material-ui/lib/styles/theme-manager';


export default React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },
    getChildContext() {
        return {
            muiTheme: ThemeManager.getMuiTheme(Theme)
        };
    },
    navigateBack(){
        this.context.router.push('/');
    },
    getLeftAction: function() {
        var currentRouteName = this.props.routes[this.props.routes.length - 1].path;
        if (currentRouteName == '/') {
            return <IconButton onClick={()=>window.close()}><NavigationClose/></IconButton>;
        } else {
            return <IconButton onClick={()=>this.navigateBack()}><ArrowBack /></IconButton>;
        }
    }, render: function() {
        return (
            <div>
                <AppBar title={<span>OC Debug</span>}
                        iconElementLeft={this.getLeftAction()}
                        style={{zoom:'75%'}}
                />
                {this.props.children}
            </div>
        )

    }
});