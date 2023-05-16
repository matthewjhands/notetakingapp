package com.thevirtugroup.postitnote.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.thevirtugroup.postitnote.model.Note;

@Repository
public interface NoteRepository extends CrudRepository<Note, Long>{
    
}
