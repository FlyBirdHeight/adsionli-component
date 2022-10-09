import { ExtractPropTypes } from 'vue';
export const buttonProps = {
    size: {
        type: String,
        default: "normal"
    },
    type: {
        type: String,
        default: "info"
    },
    round: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    icon: {
        type: String,
        default: ""
    }
} as const;
export type ButtonProps = ExtractPropTypes<typeof buttonProps>