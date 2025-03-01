import Post from '../models/Post.js'

export const createPost = async (req, res) => {
    try {
      const doc = new Post({
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: Array.isArray(req.body.tags) ? req.body.tags : req.body.tags?.split(',') || [],
        user: req.userId,
      });
  
      const post = await doc.save();
  
      res.json(post);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось создать статью',
      });
    }
  };

export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().populate('user').exec()
    res.json(posts)
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
}  

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id
    Post.findOneAndUpdate({
      _id: postId
    }, {
      $inc: { viewsCount: 1 }
    }, {
      returnDocument: 'after'
    }, 
      (err, doc) => {
        if(err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось получить одну статью',
          });
        }
        if(!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }
      }
    )
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
}  
  