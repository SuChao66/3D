export interface caseListType {
  path: string
  title: string
  description: string
  image: string
  three: boolean
}

export interface InitialStateType {
  caseList: caseListType[]
}
