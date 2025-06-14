import { Editor, EditorState, type DraftEditorCommand, type DraftHandleValue } from 'draft-js';

interface Props {
    editorState: EditorState,
    onChangeCallback: (editorState: EditorState) => void,
    handleKeyCommandCallback: (command: DraftEditorCommand, editorState: EditorState) => DraftHandleValue
}

const EditingArea = ({ editorState, onChangeCallback, handleKeyCommandCallback }: Props) => {
    return (
        < Editor
            editorState={editorState}
            onChange={onChangeCallback}
            handleKeyCommand={handleKeyCommandCallback}
            spellCheck={true}
        />
    )
};

export default EditingArea;