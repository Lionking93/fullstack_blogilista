const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs
    ? blogs.reduce((sum, blog) => {
      return sum + blog.likes
    }, 0)
    : 0
}

const favoriteBlog = (blogs) => {
  return blogs
    ? blogs.length > 0
      ? blogs.reduce((favorite, blog) => {
        return favorite.likes > blog.likes
          ? favorite
          : blog
      }, blogs[0])
      : {}
    : {}
}

const blogCountForEachBlogger = (blogs) => {
  if (!blogs) {
    return {}
  }

  const bloggersWithBlogCount = {}

  if (blogs.length > 0) {
    blogs.forEach((blog) => {
      if (!bloggersWithBlogCount.hasOwnProperty(blog.author)) {
        bloggersWithBlogCount[blog.author] = 1
      } else {
        bloggersWithBlogCount[blog.author] += 1
      }
    })
  }

  return bloggersWithBlogCount
}

const mostBlogs = (blogs) => {
  if (!blogs) {
    return {}
  }

  if (blogs.length === 0) {
    return {}
  }

  const bloggersWithBlogCount = blogCountForEachBlogger(blogs)

  const bloggerWithMostBlogs = Object
    .keys(bloggersWithBlogCount)
    .reduce((bloggerWithMostBlogs, blogger) => {
      const highestBlogCount = Object.values(bloggerWithMostBlogs)[0]
      const blogCount = bloggersWithBlogCount[blogger]

      return highestBlogCount > blogCount
        ? bloggerWithMostBlogs
        : {
          [blogger]: blogCount
        }
    },
    {
      [Object.keys(bloggersWithBlogCount)[0]]: bloggersWithBlogCount[Object.keys(bloggersWithBlogCount)[0]]
    })

  return {
    author: Object.keys(bloggerWithMostBlogs)[0],
    blogs: bloggerWithMostBlogs[Object.keys(bloggerWithMostBlogs)[0]]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  blogCountForEachBlogger,
  mostBlogs
}