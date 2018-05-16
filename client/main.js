import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import CodeMirror from "codemirror";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/lint/lint";
import "codemirror-graphql/hint";
import "codemirror-graphql/lint";
import "codemirror-graphql/mode";
import gql from "graphql-tag";
import classNames from "classnames";

const schema = `
type Query {
  hello: String
}
`.trim();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.textarea = React.createRef();
    this.state = {
      ast: null
    };
  }
  componentDidMount() {
    CodeMirror.fromTextArea(this.textarea.current, {
      mode: "graphql"
    }).on("change", cm => {
      this.setState({
        ast: gql(cm.getValue())
      });
    });
  }

  selectTab(nextTab) {
    return () => {
      this.setState({ currentTab: nextTab });
    };
  }
  render() {
    return (
      <div className="panes">
        <div className="pane">
          <textarea ref={this.textarea} defaultValue={schema} />
        </div>
        <div className="pane">
          <div className="tabs">
            <span
              className={classNames("tab", {
                active: this.state.currentTab === "graph"
              })}
              onClick={this.selectTab("graph")}
            >
              Graph
            </span>
            <span
              className={classNames("tab", {
                active: this.state.currentTab === "ast"
              })}
              onClick={this.selectTab("ast")}
            >
              AST
            </span>
          </div>
          <div
            className={classNames("graph", {
              show: this.state.currentTab === "graph"
            })}
          >
            some bubbles and shit
          </div>
          <pre
            className={classNames("ast", {
              show: this.state.currentTab === "ast"
            })}
          >
            {JSON.stringify(this.state.ast, null, "  ")}
          </pre>
        </div>
      </div>
    );
  }
}

Meteor.startup(() => {
  render(<App />, document.getElementById("app"));
});
