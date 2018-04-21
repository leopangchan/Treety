package org.calpoly.gehackathon.domain;

import javax.persistence.*;

@Entity(name="traffic")
@Table(name="traffic")
public class Traffic {

  public Integer getId() {
    return id;
  }

  @Id
  @Column(length = 40)
  @GeneratedValue
  private Integer id;

  public String localId;

  public Long time;

  public Double avgCount;

  public Double avgSpeed;

  public Traffic(String localId, Long time, Double avgCount, Double avgSpeed) {
    this.localId = localId;
    this.time = time;
    this.avgCount = avgCount;
    this.avgSpeed = avgSpeed;
  }

  public Traffic() {
  }
}
