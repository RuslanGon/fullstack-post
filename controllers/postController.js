import Post from '../models/Post.js'


export const createPost = async (req, res) => {
try {
    const doc = new Post({
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId
    })
    const post = await doc.save()
    res.json(post)
} catch (error) {
    console.log(error);
}
}