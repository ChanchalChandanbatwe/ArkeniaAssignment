const express = require('express');
const router = express.Router()
const Recipe = require('../model/recipes');
const constants = require('../constant/constant');
const multer = require('multer');
const fs = require('fs');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './uploads');
   },
  filename: function (req, file, cb) {
      cb(null , file.originalname);
  }
});

var upload = multer({ storage: storage })

router.post("/checkRecipeNameNotTaken", (req, res, next) => {
  const recipeId = req.body.id;

  Recipe.findOne({name: req.body.name})
    .then(recipe => {
      // No recipe with the same name in the database
      if (!recipe) {
        return res.json({
          nameNotTaken: true
        });
      }

      // Validate the 'edit recipe' form
      if (recipeId) {
        if (recipeId === recipe._id.toString()) {
          return res.json({
            nameNotTaken: true
          })
        } else {
          return res.json({
            nameNotTaken: false
          })
        }
      }
      // Validate the 'create recipe' form
      else {
        res.json({
          nameNotTaken: false
        })
      }
    })
    .catch(error => {
      res.json({
        nameNotTaken: true
      })
    });
});

router.post("", (req, res, next) => {
  const recipe = new Recipe({
    name: req.body.name,
    description: req.body.description,
    ingredients: req.body.ingredients.split(','),
    calories: req.body.calories,
    imageName: req.body.imageName,
    create_date: getTimestamp()
  });
  recipe.save();
  res.status(201).json({
    message: "success"
  });
});

router.delete('/:id/:imageName?', (req, res, next) => {
  Recipe.deleteOne({ _id: req.params.id }).then(success => {
    try {
      if(req.params.imageName!==undefined) {
        fs.unlinkSync('./uploads/'+req.params.imageName)
      }
      res.status(200).json({ message: 'deleted' });
    } catch(err) {
      console.error(err)
    }

  });
});


router.put("", (req, res, next) => {
  if(req.body.ingredients.indexOf(',') > -1 )
    req.body.ingredients = req.body.ingredients.split(',');
  Recipe.findByIdAndUpdate(req.body.id, {
    name: req.body.name,
    description: req.body.description,
    ingredients: req.body.ingredients,
    calories: req.body.calories,
    imageName: req.body.imageName,
    create_date: getTimestamp()
   })
    .then(documents => {
      res.status(200).json({ message: "success"});
    })
    .catch(() => {
      console.log('Error in  updating Recipe');
    });
});


router.get("", (req, res, next) => {
  Recipe.find({}).then(recipes => {
    // console.log('recipes ', recipes);
    res.status(200).json({message: "success", recipes: recipes});
  })
  .catch(() => {
    console.log('Error in getting recipes')
  })
  // getPosts(req, res, next);
});


router.post("/imageUpload", upload.single('image'), (req, res, next) => {
  res.status(200).json({message: "success"});
});


function getTimestamp() {
  let d = new Date();
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()).getTime();
}
module.exports = router;
