
import article_db from "../../../server/routes/articledb";



export default async function testread() {
  try {
    const result= await article_db.query(
      'SELECT * FROM `article_main` WHERE `id` = 1 '
    );
    console.log(result);
    
  }
  catch(err){
    console.log(err);
  }
}


// const router = createRouter();

// router.get(async (req, res) => {
//   const { id } = req.query;
//   try {
//     if (!db.data) {
//       db.data = { articles: [] };
//     }

//     const article = db.data.articles.find(article => article.id === id);
//     if (article) {
//       res.status(200).json(article);
//     } else {
//       res.status(404).json({ message: "文章未找到" });
//     }
//   } catch (error) {
//     console.error("處理過程中發生錯誤:", error);
//     res.status(500).json({ message: "伺服器錯誤" });
//   }
// });

// export default router.handler({
//     onError: (err, req, res) => {
//       console.error(err.stack);
//       res.status(err.statusCode || 500).end(err.message);
//     },
//   });