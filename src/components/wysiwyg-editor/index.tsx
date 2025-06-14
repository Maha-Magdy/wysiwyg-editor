import { useEffect, useState } from "react";
import EditingArea from "./editing-area";
import { ContentState, EditorState, RichUtils, convertFromRaw, convertToRaw, type DraftEditorCommand, type DraftHandleValue, type DraftInlineStyleType, type RawDraftContentState } from "draft-js";
import ToolBar from "./toolbar";
import "./styles.css";
import { fakeFetchContentAPI, fakeSaveContentAPI } from "../../services/fakeApi";

interface Props {
    value?: RawDraftContentState;
    callback?: (content: RawDraftContentState) => void;
    className?: string;
    style?: React.CSSProperties;
    contentApi?: string;
    onSaveSuccess?: () => void;
    onSaveError?: (error: unknown) => void;
}

function WysiwygEditor({ value, callback, className, style, contentApi, onSaveSuccess, onSaveError }: Props) {
    const [editorState, setEditorState] = useState<EditorState>(() =>
        value ? EditorState.createWithContent(convertFromRaw(value)) : EditorState.createEmpty(),
    );
    const [wordCount, setWordCount] = useState<number>(countWords(editorState.getCurrentContent()));
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const handleToolbarAction = (command: DraftInlineStyleType) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, command));
    };

    const onChangeCallback = (changedEditorState: EditorState): void => {
        const currentEditorStateContent = editorState.getCurrentContent();
        const changedEditorStateContent = changedEditorState.getCurrentContent();

        if (currentEditorStateContent !== changedEditorStateContent) {
            setHasUnsavedChanges(true);

            setWordCount(countWords(changedEditorState.getCurrentContent()));

            if (callback) {
                callback(convertToRaw(changedEditorState.getCurrentContent()));
            }
        }

        setEditorState(changedEditorState);
    };

    const handleKeyCommandCallback = (command: DraftEditorCommand, editorState: EditorState): DraftHandleValue => {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            setEditorState(newState);
            return 'handled';
        }

        return 'not-handled';
    };

    function countWords(contentState: ContentState) {
        const plainText = contentState.getPlainText('');
        const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
        return words.length;
    }

    const loadContent = async () => {
        setIsLoading(true);
        try {
            const content = await fakeFetchContentAPI();
            const contentAsEditorState = EditorState.createWithContent(convertFromRaw(content));
            setEditorState(contentAsEditorState);
            setWordCount(countWords(contentAsEditorState.getCurrentContent()));
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error("Failed to fetch content:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!hasUnsavedChanges || isSaving) return;

        setIsSaving(true);
        setSaveError(null);

        try {
            await fakeSaveContentAPI(convertToRaw(editorState.getCurrentContent()));
            setHasUnsavedChanges(false);
            onSaveSuccess && onSaveSuccess(); // Notify parent
        } catch (error) {
            console.error("Failed to save content:", error);
            setSaveError("Failed to save content. Please try again.");
            onSaveError && onSaveError(error); // Notify parent
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = async () => {
        loadContent();
    };

    // Initial content fetch if api provided
    useEffect(() => {
        if (contentApi) {
            loadContent();
        }
    }, [contentApi]);


    return (
        <>
            <div className={`wysiwyg-editor ${className || ''}`} style={style}>
                <ToolBar callback={handleToolbarAction} />

                {!isLoading && (
                    <EditingArea editorState={editorState} onChangeCallback={onChangeCallback} handleKeyCommandCallback={handleKeyCommandCallback} />
                )}

                {isLoading && (
                    <div className="wysiwyg-loading">
                        <p>Loading</p>
                        <div className="wysiwyg-dots-loader"></div>
                    </div>
                )}


                <div className={`wysiwyg-status-bar ${!contentApi ? 'word-count-status-only' : ''}`}>
                    <div className="wysiwyg-word-count">
                        <p>Word count: {wordCount}</p>
                    </div>

                    {contentApi && (
                        <div className="wysiwyg-save-actions">
                            <button title="Save" onClick={handleSave} disabled={isSaving}>
                                {!isSaving && (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#333333"><path d="M788-658v426q0 26-17 43t-43 17H232q-26 0-43-17t-17-43v-496q0-26 17-43t43-17h426l130 130Zm-28 12L646-760H232q-14 0-23 9t-9 23v496q0 14 9 23t23 9h496q14 0 23-9t9-23v-414ZM480-316q28 0 48-20t20-48q0-28-20-48t-48-20q-28 0-48 20t-20 48q0 28 20 48t48 20ZM280-572h278v-108H280v108Zm-80-74v446-560 114Z" /></svg>
                                )}
                                {isSaving && <div className="wysiwyg-dots-loader"></div>}
                            </button>

                            <button title="Cancel" onClick={handleCancel}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#333333"><path d="M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default WysiwygEditor;
