import type { DraftInlineStyleType } from "draft-js";
import type { ReactNode } from "react";
import type { ToolbarOption } from "../types/toolbar-option";
import ToolbarButton from "./toolbar-button";

const defaultOptions: ToolbarOption[] = [
    {
        title: 'Bold',
        icon: '𝐁',
        command: 'BOLD'
    },
    {
        title: 'Italic',
        icon: '𝑰',
        command: 'ITALIC'
    },
    {
        title: 'Underline',
        icon: <span style={{ textDecoration: 'underline' }}>𝐔</span>,
        command: 'UNDERLINE'
    },
    {
        title: 'Strike through',
        icon: <s>𝐀𝐁</s>,
        command: 'STRIKETHROUGH'
    },
];

interface props {
    options?: ToolbarOption[];
    callback: (command: DraftInlineStyleType) => void;
    renderToolbar?: (optionsToRender: ToolbarOption[], callback: (command: DraftInlineStyleType) => void) => ReactNode;
}

export default function ToolBar({ options, callback, renderToolbar }: props) {

    const optionsToRender = !options || options.length === 0
        ? defaultOptions
        : [...defaultOptions, ...options];

    if (renderToolbar) {
        return (
            <div className="wysiwyg-toolbar" role="toolbar">
                {renderToolbar(optionsToRender, callback)}
            </div>
        );
    }

    return (
        <div className="wysiwyg-toolbar" role="toolbar">
            {optionsToRender.map(option => (
                <ToolbarButton
                    key={option.title}
                    title={option.title}
                    icon={option.icon}
                    command={option.command}
                    callback={callback}
                />
            ))}
        </div>
    );
}