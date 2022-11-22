declare module '*.vue' {
    import type { App, DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any> & {
        install(app: App): void
    }
    export default component
}

declare type Nullable<T> = T | null;
