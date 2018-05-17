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
scalar UUID
scalar Instant

type User {
  id: UUID!
  firstName: String!
  image: Image!
}

union Image = BundledImage | UrlImage

type BundledImage {
  identifier: String!
}

type UrlImage {
  url: String!
}
`.trim();

const pretty = s => JSON.stringify(s, null, "  ");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.textarea = React.createRef();
    this.state = {
      currentTab: "graph",
      ast: null
    };
  }

  componentDidMount() {
      this.codeToAst(this.textarea.current.value)

    CodeMirror.fromTextArea(this.textarea.current, {
      mode: "graphql"
    }).on("change", cm => {
      this.codeToAst(cm.getValue())
    });
  }

  codeToAst(code) {
    try {
      const ast = gql(code)
      this.setState({ ast });
    } catch(_) {}
  }

  selectTab(nextTab) {
    return () => {
      this.setState({ currentTab: nextTab });
    };
  }

  astToBubbles() {
    return (
      this.state.ast &&
      this.state.ast.definitions.map(def => {
        const name = def.name ? def.name.value : "<unnamed>";
        return (
          <li key={name}>
            {name}
            <ul>
              {def.fields &&
                def.fields.map(field => (
                  <li key={field.name.value}>
                    <strong>{field.name.value}</strong><br />
                    <code>{field.type.type.name.value}</code>
                  </li>
                ))}
            </ul>
          </li>
        );
      })
    );
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
            {this.astToBubbles()}
          </div>
          <pre
            className={classNames("ast", {
              show: this.state.currentTab === "ast"
            })}
          >
            {pretty(this.state.ast)}
          </pre>
        </div>
      </div>
    );
  }
}

Meteor.startup(() => {
  render(<App />, document.getElementById("app"));
});
