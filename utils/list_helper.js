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

const likeCountForEachBlogger = (blogs) => {
  if (!blogs) {
    return {}
  }

  const bloggersWithLikeCount = {}

  if (blogs.length > 0) {
    blogs.forEach((blog) => {
      if (!bloggersWithLikeCount.hasOwnProperty(blog.author)) {
        bloggersWithLikeCount[blog.author] = blog.likes
      } else {
        bloggersWithLikeCount[blog.author] += blog.likes
      }
    })
  }

  return bloggersWithLikeCount
}

const getMostForAuthor = (blogs, mostFunction, mostOfWhat) => {
  if (!blogs) {
    return {}
  }

  if (blogs.length === 0) {
    return {}
  }

  const bloggersWithCount = mostFunction(blogs)

  const bloggerWithMost = Object
    .keys(bloggersWithCount)
    .reduce((bloggerWithMost, blogger) => {
      const highestCount = Object.values(bloggerWithMost)[0]
      const count = bloggersWithCount[blogger]

      return highestCount > count
        ? bloggerWithMost
        : {
          [blogger]: count
        }
    },
    {
      [Object.keys(bloggersWithCount)[0]]: bloggersWithCount[Object.keys(bloggersWithCount)[0]]
    })

  return {
    author: Object.keys(bloggerWithMost)[0],
    [mostOfWhat]: bloggerWithMost[Object.keys(bloggerWithMost)[0]]
  }
}

const mostBlogs = (blogs) => {
  return getMostForAuthor(blogs, blogCountForEachBlogger, 'blogs')
}

const mostLikes = (blogs) => {
  return getMostForAuthor(blogs, likeCountForEachBlogger, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  blogCountForEachBlogger,
  mostBlogs,
  likeCountForEachBlogger,
  mostLikes
}