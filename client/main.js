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
  render() {
    return (
      <div className="panes">
        <div className="pane">
          <textarea ref={this.textarea} defaultValue={schema} />
        </div>
        <div className="pane">
          <pre className="ast">
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
