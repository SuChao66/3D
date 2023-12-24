export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum Lang {
  ZH = 'zh',
  EN = 'en'
}

export interface InitialStateType {
  theme: Theme
  lang: Lang
}
