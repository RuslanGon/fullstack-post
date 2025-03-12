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
    const postId = req.params.id;

    const doc = await Post.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' }
    );

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
};


export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await Post.findOneAndDelete({ _id: postId });

    if (!doc) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось удалить статью",
    });
  }
};

export const updatePost = async(req, res) => {
  try {
    const postId = req.params.id;
    await Post.updateOne({ _id: postId }, {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: Array.isArray(req.body.tags) ? req.body.tags : req.body.tags?.split(',') || [],
      user: req.userId,
    })
    res.json({ success: true });
  } catch (error) {
      console.log(error);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
}

export const getLastTads = async(req, res) => {
  try {
    const posts = await Post.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }

}