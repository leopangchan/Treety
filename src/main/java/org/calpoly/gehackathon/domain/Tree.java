package org.calpoly.gehackathon.domain;

import javax.persistence.*;

@Entity
public class Tree {
    @Id
    @Column(length=40)
    @GeneratedValue
    private Integer id;

    public String type;
    public Long age;
    public Double lng;
    public Double lat;
    public Double score;
    public String local_id;
    public String email;

    public Tree() {
    }

    public Tree(String type, Long age, Double lng, Double lat, Double score, String local_id, String email) {
        this.type = type;
        this.age = age;
        this.lng = lng;
        this.lat = lat;
        this.score = score;
        this.local_id = local_id;
        this.email = email;
    }

    public Integer getId() {
        return id;
    }
}
