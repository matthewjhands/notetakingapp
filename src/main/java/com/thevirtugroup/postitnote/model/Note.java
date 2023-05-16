package com.thevirtugroup.postitnote.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "notes")
public class Note implements Serializable {
    
    @Id
    @GeneratedValue
    private Long id;

    private String body;
    
    private String title;

    public Note(Long id, String body, String title) {
        this.id = id;
        this.body = body;
        this.title = title;
    }

    protected Note(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return "Note [id=" + id + ", body=" + body + ", title=" + title + "]";
    }
    
    
}
