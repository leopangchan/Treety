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
    private Integer id;

    public String name;
    public String type;
    public Double xCoord;
    public Double yCoord;
    public String local_id;

    public Tree() {
    }

    public Tree(String name, String type, Double xCoord, Double yCoord, String local_id) {
        this.name = name;
        this.type = type;
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.local_id = local_id;
    }

    public Integer getId() {
        return id;
    }
}
