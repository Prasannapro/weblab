var express=require("express");
var router=express.Router();
const { body, validationResult } = require('express-validator');

//get model of Page
var Page=require("../models/page");



/*
   GET pages index

*/
// router.get('/',function(req,res){
//     Page.find({}).sort({sorting:1}).exec(function(err,pages){
//        res.render("admin/pages");
//        pages:pages;
//     });
//     // res.send("admin area");
// })


router.get('/', function(req, res) {
    Page.find({}).sort({ sorting: 1 }).exec()
        .then(pages => {
            res.render("admin/pages", { pages: pages });
        })
        .catch(err => {
            console.error(err);
            // Handle the error, e.g., send an error response or redirect
        });
});





/*
 GET add page
*/

router.get('/admin/add-page',function(req,res){
    var title="";
    var slug="";
    var content="";

    res.render('admin/add_page',{
      title:title,
      slug:slug,
      content:content
    });
});




/*
 POST add page
*/

// router.post('/add-page',function(req,res){

//     req.check('title','Title must have a value').notEmpty();
//     req.check('content','content must have a value').notEmpty();

//     var title=req.body.title;
//     var slug=req.body.slug.replace(/\s+/g,'-').toLowerCase();
//     if(slug == ""){
//         slug=title.replace.replace(/\s+/g,'-').toLowerCase();
//     }

//     var content=req.body.content;

//     var errors=req.validationErrors();

//     if(errors){
//         res.render('admin/add_page',{
//             title:title,
//             slug:slug,
//             content:content
//           });
//     }
//     else{
//         console.log('sucess');
//     }
//     // res.render('admin/add_page',{
//     //   title:title,
//     //   slug:slug,
//     //   content:content
//     // });
// });

router.post('/add-page', [
    body('title').notEmpty().withMessage('Title must have a value'),
    body('content').notEmpty().withMessage('Content must have a value'),
  ], async function(req, res) {
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug === "") {
      slug = title.replace(/\s+/g, '-').toLowerCase();
    }
    var content = req.body.content;
  
    var errors = validationResult(req);
  
    if (!errors.isEmpty()) {
        console.log('error');
      res.render('admin/add_page', {
        title: title,
        slug: slug,
        content: content,
        errors: errors.array()
      });
    } else {

        try {
            console.log(slug);
            const page = await Page.findOne({ slug: slug });
            console.log(page);
            if(page!=null) {
              req.flash('danger', 'Choose another slug');
              return res.render('admin/add_page', {
                title: title,
                slug: slug,
                content: content,
              });
            }
          
            const newPage = new Page({
              title: title,
              slug: slug,
              content: content,
              sorting: 100
            });
          
            await newPage.save();
            req.flash('success', 'Page added');
          
            // Clear the input fields
            title = '';
            slug = '';
            content = '';
          
            // res.redirect('/admin/pages');
          } catch (error) {
            console.log(error);
            // Handle the error
          }
          
          
          
    }
  });
  
/*
 GET edit page
*/

// router.get('/edit-page/:slug',function(req,res){
//    Page.findOne({slug:req.params.slug},function(err,page){
//       if(err){
//         return console.log(err);
//       }
//       res.render('admin/edit_page',{
//         title:page.title,
//         slug:page.slug,
//         content:page.content,
//         id:page._id
//       });
//     })

 
// });

router.get('/edit-page/:slug', async function(req, res) {
  try {
    const page = await Page.findOne({ slug: req.params.slug }).exec();

    if (!page) {
      return res.status(404).send('Page not found');
    }

    res.render('admin/edit_page', {
      title: page.title,
      slug: page.slug,
      content: page.content,
      id: page._id
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

  
module.exports=router;