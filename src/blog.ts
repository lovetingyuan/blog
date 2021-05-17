import { reactive } from 'vue'

const blogs = import.meta.glob('/src/blog/**/*.md')

const blogsMap = reactive<{
  [k: string]: {
    [k: string]: (() => Promise<{ default: string }>)
  }
}>({})

Object.keys(blogs).forEach(path => {
  const paths = path.split('/')
  const name = paths.pop()?.slice(0, -3) as string
  const cate = paths.pop() as string
  if (!blogsMap[cate]) {
    blogsMap[cate] = {
      [name]: blogs[path] as () => Promise<any>
    }
  } else {
    blogsMap[cate][name] = blogs[path] as () => Promise<any>
  }
})

export function getAllBlogList() {
  const list: string[] = []
  Object.keys(blogsMap).forEach(cate => {
    Object.keys(blogsMap[cate]).forEach(name => {
      list.push(cate + '/' + name)
    })
  })
  return list
}

export function getBlogCateList() {
  return Object.keys(blogsMap).map(cate => {
    return {
      name: cate,
      count: Object.keys(blogsMap[cate]).length
    }
  })
}

export function getBlogArticleList(cate: string) {
  return blogsMap[cate] ? Object.keys(blogsMap[cate]) : null;
}

export function getBlogContent(cate: string, name: string) {
  const fetchBlog = blogsMap[cate][name]
  if (!fetchBlog) {
    return Promise.reject()
  }
  return blogsMap[cate][name]().then(res => res.default)
}
