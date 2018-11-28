import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import classnames from 'classnames'
import { ToastContainer } from 'react-toastify'
import { Route, Switch, Redirect } from 'react-router-dom'

import Header from './Header'
import Sidebar from './Sidebar'
import SidebarFooter from './SidebarFooter'

import GuidedTour from '~/components/Tour'
import SelectContentManager from '~/components/Content/Select/Manager'
import Dashboard from '~/views/Dashboard'
import Middleware from '~/views/Middleware'
import Content from '~/views/Content'
import GhostContent from '~/views/GhostContent'
import FlowBuilder from '~/views/FlowBuilder'
import Module from '~/views/Module'
import Notifications from '~/views/Notifications'
import Logs from '~/views/Logs'
import BackendToast from '~/components/Util/BackendToast'

import PluginInjectionSite from '~/components/PluginInjectionSite'

import { viewModeChanged } from '~/actions'

import style from './style.scss'

class Layout extends React.Component {
  componentDidMount() {
    const viewMode = this.props.location.query && this.props.location.query.viewMode

    setImmediate(() => {
      this.props.viewModeChanged(viewMode || 0)
    })
  }

  render() {
    if (this.props.viewMode < 0) {
      return null
    }

    const hasHeader = this.props.viewMode <= 2
    const classNames = classnames({
      [style.container]: hasHeader,
      'bp-container': hasHeader
    })

    return (
      <div className="wrapper bp-wrapper">
        <ToastContainer position="bottom-right" />
        <Sidebar>
          <Header />
          <section className={classNames}>
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/flows" />} />
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/middleware" component={Middleware} />
              <Route exact path="/content" component={Content} />
              <Route exact path="/version-control" component={GhostContent} />
              <Route exact path="/flows/:flow*" component={FlowBuilder} />
              <Route exact path="/modules/:moduleName/:subView?" component={Module} />
              <Route exact path="/notifications" component={Notifications} />
              <Route exact path="/logs" component={Logs} />
            </Switch>
          </section>
        </Sidebar>
        <SidebarFooter />
        <GuidedTour opened={window.SHOW_GUIDED_TOUR} />
        <PluginInjectionSite site="overlay" />
        <SelectContentManager />
        <BackendToast />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  license: state.license,
  viewMode: state.ui.viewMode
})

const mapDispatchToProps = dispatch => bindActionCreators({ viewModeChanged }, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout)