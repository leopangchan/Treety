package org.calpoly.gehackathon.web;

import org.calpoly.gehackathon.domain.Environmental;
import org.calpoly.gehackathon.domain.Traffic;
import org.calpoly.gehackathon.repositories.JpaEnvironmentRepository;
import org.calpoly.gehackathon.repositories.JpaTrafficRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/environmental")
public class EnvironmentalController {

  private JpaEnvironmentRepository jpaEnvironmentRepository;

  @Autowired
  public EnvironmentalController(JpaEnvironmentRepository jpaEnvironmentRepository){
    this.jpaEnvironmentRepository = jpaEnvironmentRepository;
  }

  @PostMapping(value = "/insert")
  public String insert(@RequestBody Environmental env) {
    Environmental envNew = jpaEnvironmentRepository.save(env);
    return "Created a traffic json = " + envNew.getId();
  }

  @PostMapping(value = "/insertList")
  public String insertList(@RequestBody ArrayList<Environmental> envJsons) {
      jpaEnvironmentRepository.save(envJsons);

      return "Created " + envJsons.size() + " traffic jsons";
  }

  /* returns all rows in the database with
   * locId == locId and
   * startts >= start and
   * endts <= end
   */
  @GetMapping(value = "/timeRange")
  public List<Environmental> getTrafficTimeRange(@RequestParam(value = "start") Long start,
                                          @RequestParam(value = "end") Long end,
                                          @RequestParam(value = "locId") String locId) {
      return jpaEnvironmentRepository.findAllByLocIdAndTimeRange(locId, start, end);
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
