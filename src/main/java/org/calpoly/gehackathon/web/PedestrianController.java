package org.calpoly.gehackathon.web;

import java.util.*;
import org.calpoly.gehackathon.domain.Pedestrian;
import org.calpoly.gehackathon.repositories.jpa.JpaPedestrianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/pedestrian")
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

  @PostMapping(value = "/pedestrians")
  public String pedestrians(@RequestBody ArrayList<Pedestrian> pedestrians) {
      jpaPedestrianRepository.save(pedestrians);

      return "Created " + pedestrians.size() + " pedestrians";
  }

  /* returns all rows in the database with
   * locId == locId and
   * startts >= start and
   * endts <= end
   */
  @GetMapping(value = "/timeRange")
  public List<Pedestrian> getPedestriansTimeRange(@RequestParam(value = "start") Long start,
                                          @RequestParam(value = "end") Long end,
                                          @RequestParam(value = "locId") String locId) {
      return jpaPedestrianRepository.findAllByLocIdAndTimeRange(locId, start, end);
      //return new Long(1000);
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
