package org.calpoly.gehackathon.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Pedestrian {

  public Integer getId() {
    return id;
  }

  @Id
  @Column(length = 40)
  @GeneratedValue
  private Integer id;

  public String localId;

  public Long time;

  public Long count;

  public Pedestrian(String localId, Long time, Long count) {
    this.localId = localId;
    this.time = time;
    this.count = count;
  }
}
