package org.calpoly.gehackathon.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Tree {
    @Id
    @Column(length=40)
    @GeneratedValue
    private String id;

    public String name;
    public String type;
    public Double xCoord;
    public Double yCoord;

    public Tree() {
    }

    public Tree(String name, String type, Double xCoord, Double yCoord) {
        this.name = name;
        this.type = type;
        this.xCoord = xCoord;
        this.yCoord = yCoord;
    }

    public String getId() {
        return id;
    }
}
