import type { DraftInlineStyleType } from "draft-js";
import type { ReactNode } from "react";

export interface ToolbarOption {
    title: string;
    icon: ReactNode;
    command: DraftInlineStyleType;
}