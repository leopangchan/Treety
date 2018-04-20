package org.calpoly.gehackathon.domain;

import javax.persistence.*;

@Entity(name="pedestrian")
@Table(name="pedestrian")
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

  public Float count;

  public Pedestrian(String localId, Long time, Float count) {
    this.localId = localId;
    this.time = time;
    this.count = count;
  }

  public Pedestrian() {
  }
}
