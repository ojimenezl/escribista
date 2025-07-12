import { Router } from "express";
import Note from "../models/Note.js";
import {
  renderNoteForm,
  renderCapituloForm,
  renderPageForm,
  createNewNote,
  renderNotes,
  renderEditForm,
  updateNote,
  deleteNote,
  paginas,
  createNewPagina,
  renderSeeForm,
  seeNote,
  deleteCapitulo,
  updateCapitulo,
  handleLike,
  renderMyNotes,
  createCheckoutSession,
} from "../controllers/notes.controller.js";
import { isAuthenticated } from "../helpers/auth.js";

const router = Router();

// New Note
router.get("/notes/add", isAuthenticated, renderNoteForm);
router.get("/notes/add-capitulo/:id", isAuthenticated, renderCapituloForm);

router.post("/notes/new-note", isAuthenticated, createNewNote);

// Get All Notes
router.get("/notes", isAuthenticated, renderNotes);
router.get("/mynotes", isAuthenticated, renderMyNotes);

// Edit Notes
router.get("/notes/edit/:id", isAuthenticated, renderEditForm);

router.put("/notes/edit-note/:id", isAuthenticated, updateNote);
router.put("/capitulo/edit-cap/:id", isAuthenticated, updateCapitulo);

// Delete Notes
router.delete("/notes/delete/:id", isAuthenticated, deleteNote);
router.delete("/capitulo/delete/:id", isAuthenticated, deleteCapitulo);


//// PAGINAS
//Escribir Paginas
router.get("/notes/paginas/:id", isAuthenticated, paginas);

router.get("/notes/add-pagina", isAuthenticated, renderPageForm);

router.post("/notes/new-pagina", isAuthenticated, createNewPagina);

//mirar capitulo
router.get("/notes/see/:id", isAuthenticated, renderSeeForm);
router.put("/notes/see-note/:id", isAuthenticated, seeNote);
router.post("/notes/like/:id", handleLike);

//pagos stripe
router.post('/notes/checkout/:id', isAuthenticated, createCheckoutSession);
router.get('/notes/success/:id', async (req, res) => {
  const note = await Note.findById(req.params.id).lean(); // `.lean()` es importante para Handlebars
  res.render('notes/success', { note });
});


export default router;