import { ExtractPropTypes } from 'vue';
export const RefreshUpProps = {
    maxHeight: {
        type: Number,
        default: 300
    },
    minHeight: {
        type: Number,
        default: 100
    },
    icon: {
        type: String,
        default: ""
    },
    text: {
        type: String,
        default: "松手刷新"
    }
} as const;
export type RefreshUpProps = ExtractPropTypes<typeof RefreshUpProps>