const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Note = require("../models/Note"); //import NoteSchema from our models repository🧩

/**** Route 1 : fetch all notes of login user :
 * GET- "/api/notes/getnotes" ,
 * login require🛴🔛    ******/
router.get("/getnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    console.error(err.massage);
    res.status(500).send("Internal server errors!!");
  }
});

/**** Route 2 : Create notes of login user :
 * POST- "/api/notes/createnotes" ,
 * login require🛴🔛    ******/
router.post(
  "/createnotes",
  [
    //condition validation and errors msg
    body("title", "title can't be white space!!").isLength({ min: 1 }),
    body("description", "description can't be white spase!!").isLength({
      min: 5,
    }),
  ],
  fetchuser,
  async (req, res) => {
    try {
      //check the validation and if errors occured📍 then send bad request with error msg📧
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); //send errors array🧰🛠
      }

      const { title, description, tag } = req.body;
      const note = new Note({
        title: title,
        description: description,
        tag: tag,
        user: req.user.id
      });

      const savenote = await note.save();
      res.json(savenote);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server errors2!!" + err);
    }
  }
);

/**** Route 3 : Upadte a note of login user :
 * PUT- "/api/notes/updatenote:id" ,
 * login require🛴🔛   with node id ******/
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  //create a newNode object
  const newNode = {};
  if (title) {
    newNode.title = title;
  }
  if (description) {
    newNode.description = description;
  }
  if (tag) {
    newNode.tag = tag;
  }

  try {
    //Find the node to be updated and update it
    //check if the node own that user
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found!!");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNode },
      { new: true }
    );
    res.json({ note });
  } catch (err) {
    console.error(err.massage);
    res.status(500).send("Internal server errors2!!");
  }
});

/**** Route 4 : Delete a note of login user :
 * delete- "/api/notes/deletenote" ,
 * login require🛴🔛   with node id ******/
router.delete(
  "/deletenote/:id",
  fetchuser,
  async (req, res) => {
    try {
     let note = await Note.findById(req.params.id);


     if(!note){return res.status(404).send("Not Found!");}


     if(note.user.toString() !== req.user.id){
      return res.status(401).send("Not Allowed");
     }

     note = await Note.findByIdAndDelete(req.params.id);
     res.json({"success":"Note has been deleted", note: note});
    } catch (err) {
      console.error(err.massage);
      res.status(500).send("Internal server errors2!!");
    }
  }
);

module.exports = router;
