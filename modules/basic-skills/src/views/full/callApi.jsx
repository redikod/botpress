import React from 'react'
import { Input, Label } from 'reactstrap'
import { Tabs, Tab, Row, Col, Alert } from 'react-bootstrap'
import Select from 'react-select'
import style from './style.scss'
import { BotpressTooltip } from 'botpress/tooltip'
import { LinkDocumentationProvider } from 'botpress/documentation'

const methodOptions = [
  { label: 'Get', value: 'get' },
  { label: 'Post', value: 'post' },
  { label: 'Put', value: 'put' },
  { label: 'Delete', value: 'delete' }
]

const memoryOptions = [
  { label: 'Temp', value: 'temp' },
  { label: 'Session', value: 'session' },
  { label: 'Bot', value: 'bot' },
  { label: 'User', value: 'user' }
]

const stringify = obj => {
  return JSON.stringify(obj, null, 2)
}

// Show an example of how to write headers in a JSON format
const headersPlaceholder = stringify({
  Authorization: '<value>',
  'Content-Type': '<value>',
  'X-Custom-Headers': '<value>'
})

export class CallAPI extends React.Component {
  state = {
    selectedMethod: methodOptions[0],
    selectedMemory: memoryOptions[0],
    variable: 'response',
    body: undefined,
    headers: undefined,
    url: undefined,
    invalidJson: false
  }

  componentDidMount() {
    const data = this.props.initialData
    if (data) {
      this.setState({
        selectedMethod: data.method ? { value: data.method, label: data.method } : this.state.method,
        selectedMemory: data.memory ? { value: data.memory, label: data.memory } : this.state.memory,
        variable: data.variable ? data.variable : this.state.variable,
        body: data.body ? data.body : this.state.body,
        url: data.url ? data.url : this.state.url,
        headers: data.headers ? stringify(data.headers) : this.state.headers
      })
    }
  }

  componentDidUpdate() {
    const { selectedMethod, selectedMemory, body, url, variable, parsedHeaders, invalidJson } = this.state
    if (url && selectedMethod && selectedMemory && variable && !invalidJson) {
      const data = {
        method: selectedMethod.value,
        memory: selectedMemory.value,
        body,
        headers: parsedHeaders,
        url,
        variable,
        invalidJson
      }

      this.props.onDataChanged && this.props.onDataChanged(data)
      this.props.onValidChanged && this.props.onValidChanged(true)
    }
  }

  handleHeadersChange = event => {
    const value = event.target.value
    try {
      const parsedHeaders = JSON.parse(value)
      this.setState({ headers: value, parsedHeaders, invalidJson: false })
    } catch (e) {
      this.setState({ headers: value, invalidJson: true })
    }
  }

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleMemoryChange = option => {
    this.setState({ selectedMemory: option })
  }

  handleMethodChange = option => {
    this.setState({ selectedMethod: option })
  }

  render() {
    const paramsHelp = <LinkDocumentationProvider file="memory" />

    return (
      <div className={style.modalContent}>
        <Row className={style.callApiSection}>
          <Col md={2}>
            <Select
              id="method"
              default
              style={{ zIndex: 1000 }}
              options={methodOptions}
              value={this.state.selectedMethod}
              onChange={this.handleMethodChange}
            />
          </Col>
          <Col md={10}>
            <Input
              id="url"
              name="url"
              type="text"
              placeholder="Enter request URL"
              value={this.state.url}
              onChange={this.handleInputChange}
            />
          </Col>
        </Row>

        <Row className={style.callApiSection}>
          <Col md={12}>
            <Tabs id="requestOptionsTabs" defaultActiveKey="body" animation={false}>
              <Tab eventKey="body" title="Body">
                <Alert className={style.callApiNote} bsStyle="info">
                  Send a request body. Enter the raw payload of the request. Make sure it has proper formatting based on
                  your Content-Type. E.g. application/json content type should respect the JSON format.
                </Alert>
                <Input
                  type="textarea"
                  rows="4"
                  id="body"
                  name="body"
                  value={this.state.body}
                  onChange={this.handleInputChange}
                />
              </Tab>
              <Tab eventKey="headers" title="Headers">
                <Alert className={style.callApiNote} bsStyle="info">
                  Send request headers. Write in JSON format.
                </Alert>
                {this.state.invalidJson && (
                  <div className={style.callApiWarning}>
                    <i className="material-icons">warning</i>
                    Invalid JSON format
                  </div>
                )}
                <Input
                  type="textarea"
                  rows="5"
                  id="headers"
                  placeholder={headersPlaceholder}
                  value={this.state.headers}
                  onChange={this.handleHeadersChange}
                />
              </Tab>
              <Tab eventKey="variable" title="Memory">
                <Alert className={style.callApiNote} bsStyle="info">
                  {
                    'Store the response body in {{temp.response}} by default. You can change the memory type and the variable here.'
                  }
                </Alert>
                <Col md={6}>
                  <Label>Memory type</Label>
                  {paramsHelp}
                  <Select
                    id="storageSelect"
                    options={memoryOptions}
                    value={this.state.selectedMemory}
                    onChange={this.handleMemoryChange}
                  />
                </Col>
                <Col md={6}>
                  <Label>Variable</Label>
                  <BotpressTooltip message="The response body will be assigned to this variable" />
                  <Input type="text" name="variable" value={this.state.variable} onChange={this.handleInputChange} />
                </Col>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </div>
    )
  }
}