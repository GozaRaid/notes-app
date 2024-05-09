const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createAt = new Date().toISOString();
  const updateAt = createAt;

  const newNote = {
    title, tags, body, id, createAt, updateAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil disimpan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal disimpan',
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const ShowNoteByIdHandler = (request, h) => {
  // DATE masih invalid
  const { id } = request.params;

  const note = notes.filter((nt) => nt.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak dapat ditemukan',
  });
  response.code(404);
  return response;
};

const EditNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updateAt = new Date().toISOString();

  const indexNote = notes.findIndex((note) => note.id === id);

  if (indexNote !== -1) {
    notes[indexNote] = {
      ...notes[indexNote],
      title,
      tags,
      body,
      updateAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal diperbarui, tidak dapat menemukan catatan',
  });
  response.code(404);
  return response;
};

const DeleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const indexNote = notes.findIndex((note) => note.id === id);

  if (indexNote !== -1) {
    notes.splice(indexNote, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus, tidak dapat menemukan catatan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  ShowNoteByIdHandler,
  EditNoteByIdHandler,
  DeleteNoteByIdHandler,
};
