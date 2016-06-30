import React               from "react"

import AbstractComponent   from "../widgets/abstract-component"
import LoadingImage        from "../widgets/loading-image"

import RaisedButton from "material-ui/RaisedButton"
import TextField    from "material-ui/TextField"
import DropDownMenu from "material-ui/DropDownMenu"
import MenuItem     from 'material-ui/MenuItem'

const keys = new Set([
  "availableSecurities", "activeSecuritiesConfiguration",
  "activeSecuritiesId", "error", "message", "isSaving"
]);

export default class SecuritiesSettingView extends AbstractComponent {

  constructor(props) {
    super(props);
    this.state = {
      availableSecurities: [],
      activeSecuritiesId: null,
      activeSecuritiesConfiguration: [],
      error:   null,
      message: null
    };
  }

  componentWillMount() {
    const model = this.model();
    this.registerPropertyChangeListener(model, keys);
    let state = this.collectInitialState(model, keys);
    this.setState(state);
  }

  render() {
    const securitiesSelector = this.creattSecuritiesSelector();
    const activeSecuritiesConfigurator = this.createConfigurator();
    return (
      <div className="securities-setting setting">
        <h3>証券会社の設定</h3>
        <ul className="description">
          <li>使用する証券会社を設定します。</li>
          <li>
            アクセストークンの取得方法は
            <a onClick={ () => window.open('http://jiji2.unageanu.net/install/010000_prepare_account.html', '_blank') }>
              こちら
            </a>
            をご覧ください。
          </li>
        </ul>
        <div className="setting-body">
          {securitiesSelector}
          <div className="securities">
            {activeSecuritiesConfigurator}
          </div>
          <div className="buttons">
            {this.createErrorContent(this.state.error)}
            <RaisedButton
              label="設定"
              primary={true}
              disabled={this.state.availableSecurities.length == 0 || this.state.isSaving}
              onClick={this.save.bind(this)}
            />
            <span className="loading-for-button-action">
              {this.state.isSaving ? <LoadingImage size={20} /> : null}
            </span>
          </div>
          <div className="message">{this.state.message}</div>
        </div>
      </div>
    );
  }

  creattSecuritiesSelector() {
    if (this.state.availableSecurities.length <= 0) return null;
    return <DropDownMenu
      value={this.state.activeSecuritiesId}
      onChange={this.onChangeSecurities.bind(this)}
      style={{width: "200px"}}
      labelStyle={{
        padding: "0px"
      }}
      underlineStyle={{margin: "0px"}} >
        {this.createMenuItems()}
      </DropDownMenu>;
  }
  createConfigurator() {
    if (this.state.availableSecurities.length <= 0) return null;
    if (!this.state.activeSecuritiesConfiguration) return null;
    return this.state.activeSecuritiesConfiguration.map((c) => {
      return  <TextField
          key={c.id}
          ref={"securities_configuration_" + c.id}
          floatingLabelText={c.description}
          defaultValue={c.value}
          style={{ width: "100%" }} />;
    });
  }

  save() {
    this.model().save(this.collectConfigurations());
  }

  onChangeSecurities(e, selectedIndex, payload) {
    this.model().activeSecuritiesId = payload;
  }

  createMenuItems() {
    return this.state.availableSecurities.map((item) => {
      return <MenuItem key={item.id}
        value={item.id} primaryText={item.text} />
    });
  }

  collectConfigurations() {
    return this.state.activeSecuritiesConfiguration.reduce((r, c) => {
      r[c.id] = this.refs["securities_configuration_" + c.id].getValue();
      return r;
    }, {});
  }
  getSelectedSecuritiesIndex(id, securities=this.state.availableSecurities) {
    let index = 0;
    securities.forEach((item, i) => {
      if (item.id === id) index = i;
    });
    return index;
  }

  model() {
    return this.props.model;
  }
}
SecuritiesSettingView.propTypes = {
  model: React.PropTypes.object
};
SecuritiesSettingView.defaultProps = {
  model: null
};
