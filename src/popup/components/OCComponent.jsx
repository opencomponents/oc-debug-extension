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
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import AppIcon from 'material-ui/lib/svg-icons/navigation/apps.js';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';


class OCComponent extends Component {
  constructor(props) {
    super(props);
  }

  openRegistry() {
    return ()=> {
      chrome.tabs.create({url: this.props.registryHref});
    }
  }

  openComponent() {
    return ()=> {
      chrome.tabs.create({url: `${this.props.baseHref}${this.props.version}/~info`});
    }
  }

  openRepository() {
    return ()=> {
      chrome.tabs.create({url: this.props.metadata.repository});
    }
  }

  render() {
    const parameters = [];
    const name = this.props.name;
    const registryParameters = this.props.metadata.parameters || {};
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

      parameters.push(
        <TableRow key={key} displayBorder={false}>
          <TableRowColumn>{key}</TableRowColumn>
          <TableRowColumn>{getValueColumn(key, registryParameter.type, registryParameter.example, providedParameter)}</TableRowColumn>
          <TableRowColumn>{registryParameter.description}</TableRowColumn>
        </TableRow>
      );
    });
    return (
      <div>
        <Toolbar>
          <ToolbarGroup firstChild={true} float="left">
            <ToolbarTitle text={name} style={{paddingLeft:'1rem'}}/>
            <DropDownMenu value={this.props.version}>
              {this.props.versions.map(version=> <MenuItem key={version} value={version} primaryText={version}/>)}
            </DropDownMenu>
          </ToolbarGroup>
          <ToolbarGroup float="right">
            <IconMenu iconButtonElement={
              <IconButton touch={true}>
                <AppIcon />
              </IconButton>
            }>
              <MenuItem primaryText="Switch to Local" onTouchTap={this.props.switchToLocal}/>
              <Divider />
              <MenuItem primaryText="Go to Registry" onTouchTap={this.openRegistry()}/>
              <MenuItem primaryText="Go to Component Info" onTouchTap={this.openComponent()}/>
              <MenuItem primaryText="Go to Repository" onTouchTap={this.openRepository()}/>
            </IconMenu>

          </ToolbarGroup>
        </Toolbar>
        <div style={{'paddingLeft':1+'rem'}}>
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