import Note from "../models/Note.js";
import Capitulo from "../models/Capitulo.js";


export const renderNoteForm = (req, res) => res.render("notes/new-note");
export const renderPageForm = (req, res) => res.render("notes/new-pagina");
export const renderCapituloForm = async (req, res) => {
  const capitulo = await Capitulo.findOne({ idHistoria: req.params.id })
    .sort({ date: -1 }) // Ordenar por el campo "date" en orden descendente (-1)
    .lean();
  console.log("esatdo ", capitulo);
  if (capitulo) {
    res.render("notes/new-pagina", { idHistoria: req.params.id, capitulo });
  } else {
    res.render("notes/new-pagina", { idHistoria: req.params.id, capitulo, estado: true });

  }
}
export const createNewNote = async (req, res) => {
  const { title, description, genre, precio } = req.body;
  const errors = [];
  console.log("gratis", req.body.precio);
  if (!title) {
    errors.push({ text: "Por favor ingrese un Titulo." });
  }
  if (!description) {
    errors.push({ text: "Por favor ingrese una Descripcion" });
  }
  if (!genre) {
    errors.push({ text: "Por favor seleccione un Genero" });
  }

  if (errors.length > 0)
    return res.render("notes/new-note", {
      errors,
      title,
      description,
    });

  const newNote = new Note({ title, description, genre, precio: precio || 0 });
  newNote.creador = req.user.id;
  await newNote.save();
  req.flash("success_msg", "Note Added Successfully");
  res.redirect("/notes");
};
const isLikedByUser = (note, userId) => {
  return note.likes.includes(userId);
};
export const renderNotes = async (req, res) => {
  //const notes = await Note.find({ user: req.user.id })

  const notes = await Note.find()
    .sort({ date: "desc" })
    .lean();

  for (const note of notes) {
    const id = note._id;
    console.log(id);
    const capitulo = await Capitulo.findOne({ idHistoria: id });
    let condicion_cap = false;

    if (capitulo) {
      condicion_cap = true;
    } else {
      condicion_cap = false;
    }

    // Agrega la propiedad condicion_cap al objeto note
    note.user = req.user.id;
    note.condicion_cap = condicion_cap;
    // Consulta la cantidad de likes para el libro actual
    //console.log("notas", note);
    const countLikes = [...note.likes].length;
    note.likeTotal = countLikes
    // Verificamos si el usuario ha dado like a esta nota
    const likedByUser = isLikedByUser(note, req.user.id);
    note.liked = likedByUser;
  }

  res.render("notes/all-notes", { notes });
};
export const renderMyNotes = async (req, res) => {
  //const notes = await Note.find({ user: req.user.id })

  const notes = await Note.find({ creador: req.user.id })
    .sort({ date: "desc" })
    .lean();
  console.log("mis libros:", notes);
  for (const note of notes) {
    const id = note._id;
    console.log(id);
    const capitulo = await Capitulo.findOne({ idHistoria: id });
    let condicion_cap = false;

    if (capitulo) {
      condicion_cap = true;
    } else {
      condicion_cap = false;
    }

    // Agrega la propiedad condicion_cap al objeto note
    note.user = req.user.id;
    note.condicion_cap = condicion_cap;
    // Consulta la cantidad de likes para el libro actual
    const countLikes = [...note.likes].length;
    note.likeTotal = countLikes
    // Verificamos si el usuario ha dado like a esta nota
    const likedByUser = isLikedByUser(note, req.user.id);
    note.liked = likedByUser;
  }

  res.render("notes/all-mynotes", { notes });
};

// Función para manejar los likes
export const handleLike = async (req, res) => {
  try {
    // Obtener el ID del libro desde la URL
    const noteId = req.params.id;

    // Buscar el libro por su ID
    const note = await Note.findById(noteId);

    if (!note) {
      // Si el libro no existe, redireccionar al usuario
      return res.redirect("/notes");
    }

    // Verificar si el usuario ya ha dado like anteriormente
    const userId = req.user.id;
    const hasLiked = note.likes.includes(userId);

    if (hasLiked) {
      // Si el usuario ya ha dado like, se elimina el like
      note.likes = note.likes.filter((id) => id !== userId);
    } else {
      // Si el usuario no ha dado like, se agrega el like
      note.likes.push(userId);
    }

    // Guardar el libro actualizado en la base de datos
    await note.save();

    // Redireccionar al usuario a la página de libros nuevamente
    res.redirect("/notes");
  } catch (error) {
    console.error("Error al manejar el like:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean();
  console.log(note.creador, " edit== ", req.user.id)

  if (note.creador != req.user.id) {
    req.flash("error_msg", "Not Autorizado");
    return res.redirect("/notes");
  }
  res.render("notes/edit-note", { note });
};

export const renderSeeForm = async (req, res) => {
  const note = await Capitulo.findById(req.params.id).lean();
  console.log(req.params.id, " == ", note._id,)
  if (note._id != req.params.id) {
    req.flash("error_msg", "Not Authorized");
    return res.redirect("/notes");
  }
  res.render("notes/see-note", { note });
};

export const updateNote = async (req, res) => {
  const { title, description, genre, precio } = req.body;
  const errors = [];

  // if (!title) {
  //   errors.push({ text: "Por favor ingrese un Titulo." });
  // }
  // if (!description) {
  //   errors.push({ text: "Por favor ingrese una Descripcion" });
  // }
  // if (!genre) {
  //   errors.push({ text: "Por favor seleccione un Genero" });
  // }
  // if (errors.length > 0)
  // return res.render("notes/edit-note", {
  //   errors,
  //   title,
  //   description,
  // });
  await Note.findByIdAndUpdate(req.params.id, { title, description, genre, precio: precio || 0 });

  req.flash("success_msg", "Note Updated Successfully");
  res.redirect("/notes");
};
export const updateCapitulo = async (req, res) => {
  const { title, description, idEdit, estado } = req.body;
  const data = req.body
  await Capitulo.findByIdAndUpdate(idEdit, { title, description, estado });
  console.log("11 ", idEdit);
  console.log("12 ", data);

  //req.flash("success_msg", "Note Updated Successfully");
  res.json({ data });
};
export const seeNote = async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  console.log("2");

  req.flash("success_msg", "Note Updated Successfully");
  res.redirect("/notes");
};
export const deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Note Deleted Successfully");
  res.redirect("/notes");
};
export const deleteCapitulo = async (req, res) => {
  await Capitulo.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Note Deleted Successfully");
  res.redirect("/notes");
};


export const paginas = async (req, res) => {
  const foundNote = await Capitulo.find({ idHistoria: req.params.id }).lean();

  const idHistoria = req.params.id;
  console.log("idHistoria", idHistoria);
  if (foundNote.length > 0) {
    foundNote.forEach((foundNot) => {
      foundNot.actual = req.user.id; // Reemplaza "valor de user" con el valor real que deseas agregar a cada nota
    });
    res.render("notes/all-pagina", { foundNote, creador: foundNote[0].user });
  } else {
    res.redirect("/notes/add-capitulo/" + idHistoria);
  }
};


export const createNewPagina = async (req, res) => {
  const { title, description, idHistoria, url, estado } = req.body;
  console.log("aquii desc", description, "title", title, idHistoria, url);
  const errors = [];

  if (errors.length > 0)
    return res.render("notes/new-note", {
      errors,
      title,
      description,
    });

  const newNote = new Capitulo({ title, description, idHistoria, url, estado });
  newNote.user = req.user.id;

  try {
    // Guardar el nuevo documento en MongoDB
    const savedNote = await newNote.save();

    // Obtener el ID del nuevo objeto creado
    const newObjectId = savedNote._id;

    req.flash("success_msg", "Note Added Successfully");
    // res.render("/notes",{ savedNoteId: newObjectId });
    res.json({ savedNoteId: newObjectId });
  } catch (err) {
    console.error("Error al guardar el documento:", err);
    // Manejar el error si ocurre durante el guardado
    // Redirigir o renderizar una página de error, según corresponda
  }
};
