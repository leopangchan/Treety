package org.calpoly.gehackathon.domain;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * TODO: Link Tree entity with Email entity
 * */
public class Email {
  @Id
  @Column(length = 40)
  @GeneratedValue
  private Integer id;

  public String email;

  public Email(String email) {
    this.email = email;
  }
}
