package com.thevirtugroup.postitnote.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.thevirtugroup.postitnote.model.Note;
import com.thevirtugroup.postitnote.repository.NoteRepository;

/**
 */
@RestController
@RequestMapping(value="/api")
public class NoteController
{
    @Autowired
    private NoteRepository noteRepository;

    public NoteController() {
    }

    @RequestMapping(method = RequestMethod.GET, path = "/notes")
    Iterable<Note> all() {
      return noteRepository.findAll();
    }

    @RequestMapping(method = RequestMethod.POST, path = "/notes")
    Note newNote(@RequestBody Note newNote) {
      return noteRepository.save(newNote);
    }
    
    @RequestMapping(method = RequestMethod.GET, path = "/notes/{id}")
    Note one(@PathVariable Long id) {
      
      return noteRepository.findOne(id);
    }
  
    @RequestMapping(method = RequestMethod.PUT, path = "/notes/{id}")
    Note replaceNote(@RequestBody Note newNote, @PathVariable Long id) {
      
      Note oldNote = noteRepository.findOne(id);

      oldNote.setTitle(newNote.getTitle());
      oldNote.setBody(newNote.getBody());

      return noteRepository.save(oldNote);

    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/notes/{id}")
    void deleteNote(@PathVariable Long id) {
      noteRepository.delete(id);
    }

    public void setNoteRepository(NoteRepository noteRepository) {
      this.noteRepository = noteRepository;
    }
}
