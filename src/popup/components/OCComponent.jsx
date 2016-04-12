import React, { Component } from 'react'

import RaisedButton from 'material-ui/lib/raised-button';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import Toggle from 'material-ui/lib/toggle';
import TextField from 'material-ui/lib/text-field';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';

class OCComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const parameters = [];
        const name = this.props.name;
        const registryParameters = this.props.metadata.parameters;
        const providedParameters = this.props.renderedComponent.parameters;
        const editParameter = this.props.editParameter;
        const getValueColumn = (key, type, example, value)=> {
            switch (type) {
                case 'boolean':
                    return (<Toggle
                        defaultToggled={value}
                        onToggle={(event)=> {
                            editParameter(key, event.target.checked);
                        }}
                    />);
                case 'number':
                case 'string':
                default:
                    return (<TextField
                        value={value}
                        hintText={example}
                        onChange={(event)=> {
                            editParameter(key, event.target.value);
                        }}
                    />);
            }
        };
        const registryParameterKeys = Object.keys(registryParameters);
        registryParameterKeys.forEach(function(key) {
            var registryParameter = registryParameters[key];
            var providedParameter = providedParameters[key];
            var selected = (registryParameter.mandatory || providedParameter != null) ? true : false;
            var selectable = !registryParameter.mandatory;

            parameters.push(
                <TableRow key={key} displayBorder={false}>
                    <TableRowColumn>{key}</TableRowColumn>
                    <TableRowColumn>{getValueColumn(key, registryParameter.type, registryParameter.example, providedParameter)}</TableRowColumn>
                    <TableRowColumn>{registryParameter.description}</TableRowColumn>
                </TableRow>
            );
        });
        const versions = [];
        this.props.versions.forEach(function(version) {
            versions.push(
                <MenuItem key={version} value={version} primaryText={version}/>
            );
        });
        return (
            <div style={{'paddingLeft':1+'rem'}}>
                <div>
                    <h2 style={{float:'left', 'marginTop':1.55+'rem','marginBottom':0}}>{name}</h2>
                    <SelectField
                        style={{float:'right'}}
                        floatingLabelText='Version'
                        value={this.props.version}
                        onChange={(_,__,v)=>this.props.changeVersion(v)}
                    >
                        {versions}
                    </SelectField>
                </div>
                <div style={{clear:'both', 'paddingTop':'2rem'}}>
                    <Table multiSelectable={false} selectable={false}>
                        <TableHeader adjustForCheckbox={false}
                                     displaySelectAll={false}
                                     enableSelectAll={false}
                                     style={{'textAlign':'left'}}>
                            <TableRow>
                                <TableHeaderColumn>Parameter</TableHeaderColumn>
                                <TableHeaderColumn>Value</TableHeaderColumn>
                                <TableHeaderColumn>Description</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {parameters}
                        </TableBody>
                    </Table>
                    <Divider/>
                    <div style={{padding:1+'rem'}}>
                        <div style={{textAlign:'center'}}>
                            <RaisedButton label="Apply"
                                          style={{marginLeft:1+'rem', marginRight:1+'rem'}}
                                          onTouchTap={this.props.apply}/>
                            <RaisedButton label="Reset" secondary={true}
                                          style={{marginLeft:1+'rem',marginRight:1+'rem'}}
                                          onTouchTap={this.props.reset}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default OCComponent;