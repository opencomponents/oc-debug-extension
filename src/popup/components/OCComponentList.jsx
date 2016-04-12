import React from 'react';
import {connect} from 'react-redux';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

export const OCComponentList = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },

    navigateToComponent: function(item) {
        this.context.router.push(`/component/${item.name}/${item.version}`);
    },

    render: function() {
        var components = [];
        const self = this;
        this.props.components.forEach(function(item) {
            components.push(
                <ListItem key={item.name} primaryText={item.name} onTouchTap={()=>self.navigateToComponent(item)}/>
            );
        });
        return <div>
            <List>
                {components}
            </List>
        </div>;
    }
});

function mapStateToProps(state) {
    const stateObj = state.toJS();
    const components = Object.keys(stateObj).map(function(component) {
        return {
            name: component,
            version: stateObj[component].renderedComponent.version
        };
    });
    return {components: components};
}

export default connect(mapStateToProps)(OCComponentList);