import React, { Component, PropTypes } from 'react'
import {connect} from 'react-redux';
import {requestComponent,editParameter,reload,apply} from '../actions';
import CircularProgress from 'material-ui/lib/circular-progress';
import OCComponent from './OCComponent'
class OCComponentContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let {dispatch,baseHref,version,metadata,error}=this.props;
        if (error) {
            return;
        }
        if (metadata == null) {
            dispatch(requestComponent(baseHref + version + '/~info'));
        }
    }

    editParameter() {
        const {name ,version,dispatch}= this.props;
        return (parameter, value)=> {
            dispatch(editParameter(name, version, parameter, value));
        };
    }

    changeVersion() {
        const {dispatch,baseHref}=this.props;
        return (version)=> {
            this.context.router.push(`/component/${this.props.name}/${version}`);
            dispatch(requestComponent(baseHref + version + '/~info'));
        }
    }

    reload() {
        const {dispatch,name}=this.props;
        return () => {
            dispatch(reload(name));
        };
    }

    apply() {
        const {dispatch,name,version,renderedComponent,baseHref}=this.props;
        return () => {
            dispatch(apply(name, version, renderedComponent, baseHref));
        };
    }

    render() {
        return (
            <div style={{position:'relative', 'minHeight':'30rem'}}>
                {this.props.metadata === null &&
                <div
                    style={{margin: 0, position:'absolute',top: '50%',left: '50%', 'marginRight': '-50%'}}>
                    <CircularProgress />
                </div>
                }
                { this.props.metadata && this.props.metadata &&
                <OCComponent {...this.props} editParameter={this.editParameter()}
                                             reset={ this.reload()}
                                             apply={ this.apply()}
                                             changeVersion={ this.changeVersion()}
                />
                }
            </div>
        );
    }
}
OCComponentContainer.propTypes = {
    name: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
};
OCComponentContainer.contextTypes = {
    router: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const stateObject = state.toJS();
    const name = ownProps.params.component;
    const version = ownProps.params.version;
    var metadata = null;
    if (stateObject[name] && stateObject[name][version]) {
        metadata = stateObject[name][version];
    }
    return {
        name: name,
        baseHref: stateObject[name].baseHref,
        version: version,
        renderedComponent: stateObject[name].renderedComponent,
        metadata: metadata,
        versions: stateObject[name].versions,
        error: stateObject.error
    }
}
export default connect(mapStateToProps)(OCComponentContainer)
