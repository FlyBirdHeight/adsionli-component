import { ExtractPropTypes } from 'vue';
export const RefreshProps = {
    drag: {
        type: String,
        default: "up"
    },
    maxHeight: {
        type: Number,
        default: 80
    },
    minHeight: {
        type: Number,
        default: 40
    },
    icon: {
        type: String,
        default: ""
    },
    text: {
        type: String,
        default: "正在刷新"
    },
    boxHeight: {
        type: String || Number,
        default: "auto"
    }
} as const;
export type RefreshProps = ExtractPropTypes<typeof RefreshProps>