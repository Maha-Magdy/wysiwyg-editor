import type { RawDraftContentState } from "draft-js";

let fakeContent: RawDraftContentState = {
    "blocks": [
        {
            "key": "ag63l",
            "text": "This is initial content loaded from our 'fake' server!",
            "type": "header-two",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
        },
        {
            "key": "54ace",
            "text": "You can edit this and then click on 'Save' button to save it.",
            "type": "unstyled",
            "depth": 0,
            "inlineStyleRanges": [
                { "offset": 35, "length": 7, "style": "BOLD" }
            ],
            "entityRanges": [],
            "data": {}
        }
    ],
    "entityMap": {}
};

export const fakeFetchContentAPI = (): Promise<RawDraftContentState> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(fakeContent);
        }, 1000);
    });
}

export const fakeSaveContentAPI = (content: RawDraftContentState): Promise<{ success: boolean; timestamp: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            fakeContent = content;
            resolve({ success: true, timestamp: new Date().toISOString() });
        }, 1000);
    })
}