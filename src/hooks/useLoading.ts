import { useState } from "react";

interface LoadingCtx {
    visible: boolean | null,
    setVisible: (data: boolean) => void
};

const LoadContext: LoadingCtx = {
    visible: null, 
    setVisible: (data) => {},
};

export const createVisible = () => {
    const [visible, setVisible] = useState(false);
    LoadContext.visible = visible;
    LoadContext.setVisible = setVisible;

    return LoadContext
};

export const useLoading = () => {return LoadContext;}