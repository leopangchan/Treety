package org.cloudfoundry.samples.music.domain;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Tree {


    public String getId() {
        return id;
    }

    @Id
    @Column(length=40)
    @GeneratedValue(generator="randomId")
    @GenericGenerator(name="randomId", strategy="org.cloudfoundry.samples.music.domain.RandomIdGenerator")
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
}
