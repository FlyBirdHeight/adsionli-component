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
        default: "松开刷新..."
    },
    loadText: {
        type: String,
        default: "正在刷新..."
    },
    successText: {
        type: String,
        default: "刷新成功..."
    },
    overTimeText: {
        type: String,
        default: "刷新失败，请重试..."
    },
    boxHeight: {
        type: String || Number,
        default: "auto"
    },
    refreshFunc: {
        type: Function,
        default: null
    },
    timeLimit: {
        type: Number,
        default: 5000
    }
} as const;
export type RefreshProps = ExtractPropTypes<typeof RefreshProps>