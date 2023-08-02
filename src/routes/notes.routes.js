import { Router } from "express";
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
} from "../controllers/notes.controller.js";
import { isAuthenticated } from "../helpers/auth.js";

const router = Router();

// New Note
router.get("/notes/add", isAuthenticated, renderNoteForm);
router.get("/notes/add-capitulo/:id", isAuthenticated, renderCapituloForm);

router.post("/notes/new-note", isAuthenticated, createNewNote);

// Get All Notes
router.get("/notes", isAuthenticated, renderNotes);

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


export default router;