import type { DraftInlineStyleType } from "draft-js";
import type { ToolbarOption } from "../types/toolbar-option";

interface Props extends ToolbarOption {
    callback: (command: DraftInlineStyleType) => void;
}

export default function ToolbarButton({ title, icon, command, callback }: Props) {
    const handleOnMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        callback(command);
    }

    return (
        <button
            className="wysiwyg-button"
            tabIndex={-1}
            title={title}
            type="button"
            onMouseDown={handleOnMouseDown}
        >
            {icon}
        </button>
    );
}