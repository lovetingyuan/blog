export interface BlogMetaInfo {
  title: string
  date: string
  keywords: string
}

export interface BlogMeta {
  [k: string]: Record<string, BlogMetaInfo>
}

export type BlogMetaItem = {
  name: string
  cate: string
} & BlogMetaInfo

export type BlogListMap = Record<string, BlogMetaItem[]>

export interface Store {
  blogMetaApi: BlogMeta
  blogMetaView: BlogListMap
  cateListView: [string, number][]
  currentCate: string
  currentBlogName: string
  allBlogListView: BlogMetaItem[],
  currentBlogListView: BlogMetaItem[]
  errorPage: boolean
}
