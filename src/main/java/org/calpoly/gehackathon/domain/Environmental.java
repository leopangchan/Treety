package org.calpoly.gehackathon.domain;

import javax.persistence.*;

@Entity(name="environment")
@Table(name="environment")
public class Environmental {

  public Integer getId() {
    return id;
  }

  @Id
  @Column(length = 40)
  @GeneratedValue
  private Integer id;

  public String localId;

  public Long time;

  public Double evapotranspiration;

  public Double carbonReduction;

  public Environmental(String localId, Long time, Double evapotranspiration, Double carbonReduction) {
    this.localId = localId;
    this.time = time;
    this.evapotranspiration = evapotranspiration;
    this.carbonReduction = carbonReduction;
  }

  public Environmental() {
  }
}
