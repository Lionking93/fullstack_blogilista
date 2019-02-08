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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}