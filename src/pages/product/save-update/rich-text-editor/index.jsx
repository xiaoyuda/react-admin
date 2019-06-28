import React, { Component } from 'react';
import { EditorState, ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import PropTypes from 'prop-types';
import htmlToDraft from 'html-to-draftjs';

export default class RichTextEditor extends Component {
  static propTypes={
    detail: PropTypes.string.isRequired
  };

  state = {
    editorState: EditorState.createEmpty(),
  };

  onEditorStateChange=(editorState) => {
    //这个值是要拿到的值，怎么传出去？
    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    this.setState({
      editorState,
    });
  };

  componentDidMount() {
    const { editorState } = this.state;
    const contentBlock = htmlToDraft(this.props.detail);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({ editorState })
    }
  }

  render() {

    return (
      <div>
        <Editor
          editorState={this.state.editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}