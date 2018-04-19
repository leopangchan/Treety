package org.calpoly.gehackathon.web;

import org.calpoly.gehackathon.domain.Pedestrian;
import org.calpoly.gehackathon.domain.Traffic;
import org.calpoly.gehackathon.repositories.JpaPedestrianRepository;
import org.calpoly.gehackathon.repositories.JpaTrafficRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/traffic")
public class TrafficController {

  private JpaTrafficRepository jpaTrafficRepository;

  @Autowired
  public TrafficController(JpaTrafficRepository jpaTrafficRepository){
    this.jpaTrafficRepository = jpaTrafficRepository;
  }

  @PostMapping(value = "/insert")
  public String insert(@RequestBody Traffic traffic) {
    Traffic trf = jpaTrafficRepository.save(traffic);
    return "Created a traffic json = " + trf.getId();
  }

  @PostMapping(value = "/insertList")
  public String insertList(@RequestBody ArrayList<Traffic> trafficJsons) {
      jpaTrafficRepository.save(trafficJsons);

      return "Created " + trafficJsons.size() + " traffic jsons";
  }

  /* returns all rows in the database with
   * locId == locId and
   * startts >= start and
   * endts <= end
   */
  @GetMapping(value = "/timeRange")
  public List<Traffic> getTrafficTimeRange(@RequestParam(value = "start") Long start,
                                          @RequestParam(value = "end") Long end,
                                          @RequestParam(value = "locId") String locId) {
      return jpaTrafficRepository.findAllByLocIdAndTimeRange(locId, start, end);
  }

  //Get Weekly
  @GetMapping(value = "/weekly")
  public Long getWeeklyPedestrianCount(@RequestParam(value = "start") Long start,
                                       @RequestParam(value = "end") Long end,
                                       @RequestParam(value = "locId") String locId) {
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
