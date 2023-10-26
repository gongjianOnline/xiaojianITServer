const router = require('koa-router')()
const db = require("../util/mysql.js")

/**获取课程分类 */
router.get('/getMajorList', async (ctx, next) => {
    let result = await db.queryDB("select * from major");
    ctx.body = {
      ...result,
      message:'查询成功'
    }
})


/**获取菜单id */
router.get("/getTagList",async (ctx,next)=>{
  let result = await db.queryDB("select * from tag");
  ctx.body = {
    ...result,
    message:'查询成功'
  }
})

/**获取热门课程内容*/
router.get("/getHotCourseList",async (ctx,next)=>{
  let majorList = await db.queryDB("select * from major");
  let formData = [];
  for(let i = 0;i<majorList["data"].length;i++){
    /**查询课程内容 */
    let result = await db.queryDB(`select * from course WHERE major=${majorList["data"][i]['majorId']}`);
    let resultData = result['data'];
    resultData.forEach(element => {
      element.majorLabel = majorList["data"][i]['majorLabel'];
      formData.push(element)
    });
  }
  ctx.body = {
    code:101,
    data:formData,
    message:'请求成功'
  }
})


/**获取常规课程列表(根据tag分类获取) */
router.get("/getCourseList",async (ctx,next)=>{
  let {tagId} = ctx.query;
  /**查询课程内容 */
  let result = await db.queryDB(`select * from course WHERE tagId=${tagId}`);
  ctx.body = {
    ...result,
    message:"查询成功"
  }
})

/**获取常规课程列表(根据major分类获取) */
router.get("/getMajorCourseList",async (ctx,next)=>{
  let {majorId} = ctx.query;
  /**查询课程内容 */
  let result = await db.queryDB(`select * from course WHERE major=${majorId}`);
  ctx.body = {
    ...result,
    message:"查询成功"
  }
})


/**添加新课程*/
router.post("/createCourse",async(ctx,next)=>{
  let bodyData = ctx.request.body;
  console.log(bodyData)
  let result = await db.addDB(
    "INSERT INTO course SET ?",
    bodyData
  );
  ctx.body = {
    data:result
  }

})

module.exports = router
