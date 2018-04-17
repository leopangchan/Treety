package org.cloudfoundry.samples.music.web;

import org.cloudfoundry.samples.music.domain.Pedestrian;
import org.cloudfoundry.samples.music.repositories.jpa.JpaPedestrianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController(value = "/pedestrian")
public class PedestrianController {

  private JpaPedestrianRepository jpaPedestrianRepository;

  @Autowired
  public PedestrianController(JpaPedestrianRepository jpaPedestrianRepository){
    this.jpaPedestrianRepository = jpaPedestrianRepository;
  }

  @PostMapping(value = "/insert")
  public String insert(@RequestBody Pedestrian pedestrian) {
    Pedestrian p = jpaPedestrianRepository.save(pedestrian);
    return "Created a pedestrian = " + p.getId();
  }

  @GetMapping(value = "/timeRange")
  public Long getPedestrianTimeRangeCount(@RequestParam(value = "start") Long start,
                                          @RequestParam(value = "end") Long end) {
    return new Long(1000);
  }

  //Get Weekly
  @GetMapping(value = "/weekly")
  public Long getWeeklyPedestrianCount(@RequestParam(value = "start") Long start,
                                       @RequestParam(value = "end") Long end) {
    return new Long(1000);
  }

  //Get Monthly
  @GetMapping(value = "/monthly")
  public Long getMonthlyPedestrianCount(@RequestParam(value = "start") Long start,
                                        @RequestParam(value = "end") Long end) {
    return new Long(1000);
  }

  //Get Yearly
  @GetMapping(value = "/yearly")
  public Long getYearlyPedestrianCount(@RequestParam(value = "start") Long start,
                                       @RequestParam(value = "end") Long end) {
    return new Long(1000);
  }
}
