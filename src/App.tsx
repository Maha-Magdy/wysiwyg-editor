import { useState } from 'react'
import './App.css'
import WysiwygEditor from './components/wysiwyg-editor'
import { convertFromRaw, type RawDraftContentState } from 'draft-js'

function App() {
  const [controlledModeValue, setControlledModeValue] = useState<RawDraftContentState>(
    {
      "blocks": [
        {
          "key": "532r6",
          "text": "This uses controlled mode with external state management, where the parent component's RawDraftContentState value is used to show summary of the content status.",
          "type": "unstyled",
          "depth": 0,
          "inlineStyleRanges": [
            {
              "offset": 10,
              "length": 15,
              "style": "BOLD"
            },
            {
              "offset": 87,
              "length": 26,
              "style": "BOLD"
            },
            {
              "offset": 153,
              "length": 7,
              "style": "BOLD"
            }
          ],
          "entityRanges": [],
          "data": {}
        }
      ],
      "entityMap": {}
    }
  );

  const [controlledModeValueHasChanged, setControlledModeValueHasChanged] = useState<boolean>(false);

  const controlledModeCallback = (content: RawDraftContentState): void => {
    setControlledModeValue(content);
    setControlledModeValueHasChanged(true);
  }

  return (
    <div className="wysiwyg-editor-demo">
      <div>
        <h2>Controlled Component mode with External State</h2>
        <p>When both a value prop and an onChange callback are provided, a component operates in controlled mode. This example extract the component's status if changed, and the latest word count from the controlled value in the parent component.</p>
        <WysiwygEditor value={controlledModeValue} callback={controlledModeCallback} />
        <div className='preview-controlled-component-status'>
          {!controlledModeValueHasChanged && (
            <p>The content has not been changed yet.</p>
          )}

          {controlledModeValueHasChanged && (
            <p>The content has been changed and the current word count is {convertFromRaw(controlledModeValue).getPlainText().trim().split(/\s+/).filter(word => word.length > 0).length}.</p>
          )}
        </div>
      </div>

      <div>
        <h2>Uncontrolled Component mode with internal state</h2>
        <p>When both a value prop and an onChange callback are not provided, a component manages its own state.</p>
        <WysiwygEditor />
      </div>

      <div>
        <h2>WysiwygEditor using an api call</h2>
        <p>When an api provided, a component operates a async behaviour to fill the editor with content, and send the edited content on save. Additionally, edits can be canceled if they are not saved, allowing a return to the last saved content.</p>
        <WysiwygEditor contentApi='https://fake-api'/>
      </div>
    </div>
  )
}

export default App
